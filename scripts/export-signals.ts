/**
 * Aggregate user feedback (swipes, favorites, applications) into a
 * compact JSON signal file the scraper can read to prioritize what to
 * scrape next.
 *
 * Quality safeguards:
 *  - Event type weighting   apply (3.0) > favorite (2.0) > swipe-like (1.0)
 *  - Recency decay          half-life 30 days, recent events count more
 *  - Filter-bubble defense  base keywords have a floor weight; signal-derived
 *                           keywords are capped so the scraper keeps exploring
 *
 * Output:
 *   - <repo>/prisma/signals.json
 *   - C:/GitProject/スクレイパー製作/signals.json (if dir exists)
 *
 * Run:
 *   npm run signals:export
 */
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";

const baseUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
if (!baseUrl) throw new Error("DATABASE_URL not set");
const connectionString = baseUrl.includes("connect_timeout=")
  ? baseUrl
  : baseUrl + (baseUrl.includes("?") ? "&" : "?") + "connect_timeout=30";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

// ---- Weighting constants ----
const WEIGHT_SWIPE_LIKE = 1.0;
const WEIGHT_FAVORITE = 2.0;
const WEIGHT_APPLY = 3.0;
const HALF_LIFE_DAYS = 30; // events decay to 50% weight after this many days
const SIGNAL_KEYWORD_CAP = 0.6; // signal-derived keywords cannot exceed this
const BASE_KEYWORD_FLOOR = 0.4; // base keywords always at least this weight

interface Signals {
  generatedAt: string;
  totals: {
    swipes: number;
    likes: number;
    skips: number;
    favorites: number;
    applications: number;
  };
  industries: Array<{ name: string; score: number; positive: number; negative: number }>;
  locations: Array<{ name: string; score: number; positive: number; negative: number }>;
  cultureTags: Array<{ tag: string; score: number }>;
  salaryBands: Array<{ band: string; score: number; positive: number; negative: number }>;
  keywordWeights: Array<{ keyword: string; weight: number; reason: string }>;
}

function bandFor(annualMan: number): string {
  if (annualMan < 250) return "<250万";
  if (annualMan < 350) return "250-350万";
  if (annualMan < 450) return "350-450万";
  if (annualMan < 600) return "450-600万";
  return "600万+";
}

function parseAnnualMan(s: string): number {
  const m = s?.match(/(\d+)万円/);
  return m ? parseInt(m[1]) : 0;
}

function prefectureOf(loc: string): string {
  if (!loc) return "";
  const m = loc.match(/^(東京都|北海道|(?:京都|大阪)府|.+?県)/);
  return m ? m[1] : "";
}

function decay(date: Date | null | undefined, now: number): number {
  if (!date) return 1;
  const ageDays = (now - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return 1;
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
}

interface Bucket {
  positive: number; // weighted positive signal
  negative: number; // weighted negative signal (only swipe skips)
}

function emptyBucket(): Bucket {
  return { positive: 0, negative: 0 };
}

async function main() {
  const now = Date.now();

  const [rawSwipes, favorites, applications, profiles] = await Promise.all([
    prisma.swipe.findMany({
      select: { action: true, companyId: true, createdAt: true },
    }),
    prisma.favorite.findMany({ select: { companyId: true, createdAt: true } }),
    prisma.application.findMany({ select: { companyId: true, createdAt: true } }),
    prisma.companyProfile.findMany({
      select: { companyId: true, industry: true, location: true, culture: true, annualSalary: true },
    }),
  ]);
  const profileById = new Map(profiles.map((p) => [p.companyId, p]));

  const totalSwipes = rawSwipes.length;
  const likes = rawSwipes.filter((s) => s.action === "like").length;
  const skips = rawSwipes.filter((s) => s.action === "skip").length;

  // ---- Aggregate weighted signals ----
  const indStats = new Map<string, Bucket>();
  const locStats = new Map<string, Bucket>();
  const cultureLikes = new Map<string, number>();
  const salaryStats = new Map<string, Bucket>();

  function addEvent(companyId: number, weight: number, isNegative: boolean) {
    const p = profileById.get(companyId);
    if (!p) return;
    const ind = p.industry || "その他";
    const loc = prefectureOf(p.location || "") || "不明";
    const annual = parseAnnualMan(p.annualSalary || "");
    const band = annual ? bandFor(annual) : "";
    const culture = (p.culture || "").split(",").map((t: string) => t.trim()).filter(Boolean);

    const indEntry = indStats.get(ind) || emptyBucket();
    const locEntry = locStats.get(loc) || emptyBucket();
    const salEntry = band ? (salaryStats.get(band) || emptyBucket()) : null;

    if (isNegative) {
      indEntry.negative += weight;
      locEntry.negative += weight;
      if (salEntry) salEntry.negative += weight;
    } else {
      indEntry.positive += weight;
      locEntry.positive += weight;
      if (salEntry) salEntry.positive += weight;
      for (const c of culture) cultureLikes.set(c, (cultureLikes.get(c) || 0) + weight);
    }

    indStats.set(ind, indEntry);
    locStats.set(loc, locEntry);
    if (salEntry && band) salaryStats.set(band, salEntry);
  }

  // Swipes (positive: like, negative: skip)
  for (const s of rawSwipes) {
    const w = WEIGHT_SWIPE_LIKE * decay(s.createdAt, now);
    addEvent(s.companyId, w, s.action !== "like");
  }
  // Favorites (only positive)
  for (const f of favorites) {
    const w = WEIGHT_FAVORITE * decay(f.createdAt, now);
    addEvent(f.companyId, w, false);
  }
  // Applications (strongest positive signal)
  for (const a of applications) {
    const w = WEIGHT_APPLY * decay(a.createdAt, now);
    addEvent(a.companyId, w, false);
  }

  function rank(m: Map<string, Bucket>): Array<{ name: string; score: number; positive: number; negative: number }> {
    return [...m.entries()]
      .map(([name, v]) => {
        const total = v.positive + v.negative;
        // Wilson-ish lower bound to penalize tiny samples
        const rate = total > 0 ? v.positive / total : 0;
        const score = rate * Math.log1p(total); // log-volume * positive-rate
        return { name, score, positive: v.positive, negative: v.negative };
      })
      .filter((e) => e.positive + e.negative >= 1)
      .sort((a, b) => b.score - a.score);
  }

  const industries = rank(indStats);
  const locations = rank(locStats);
  const salaryBands = rank(salaryStats).map((e) => ({ band: e.name, score: e.score, positive: e.positive, negative: e.negative }));
  const cultureTags = [...cultureLikes.entries()]
    .map(([tag, score]) => ({ tag, score }))
    .sort((a, b) => b.score - a.score);

  // ---- Build keyword weights ----
  const baseKeywords = [
    { keyword: "高卒", weight: 1.0, reason: "primary target audience" },
    { keyword: "学歴不問", weight: 0.6, reason: "captures inclusive jobs" },
    { keyword: "未経験歓迎", weight: 0.5, reason: "captures entry-level" },
  ];

  // Apply floor — base keywords are guaranteed exploration weight
  for (const k of baseKeywords) {
    if (k.weight < BASE_KEYWORD_FLOOR) k.weight = BASE_KEYWORD_FLOOR;
  }

  // Add signal-derived keywords, but cap them so they cannot dominate
  const signalKeywords: typeof baseKeywords = [];
  const topLoc = locations[0];
  if (topLoc && topLoc.score > 0 && topLoc.name !== "不明") {
    signalKeywords.push({
      keyword: `高卒 ${topLoc.name}`,
      weight: Math.min(SIGNAL_KEYWORD_CAP, topLoc.score),
      reason: `users prefer ${topLoc.name} (score=${topLoc.score.toFixed(2)})`,
    });
  }
  const topInd = industries[0];
  if (topInd && topInd.score > 0) {
    signalKeywords.push({
      keyword: `高卒 ${topInd.name}`,
      weight: Math.min(SIGNAL_KEYWORD_CAP, topInd.score),
      reason: `users prefer ${topInd.name} industry (score=${topInd.score.toFixed(2)})`,
    });
  }

  const allKeywords = [...baseKeywords, ...signalKeywords].sort(
    (a, b) => b.weight - a.weight
  );

  const signals: Signals = {
    generatedAt: new Date().toISOString(),
    totals: {
      swipes: totalSwipes,
      likes,
      skips,
      favorites: favorites.length,
      applications: applications.length,
    },
    industries: industries.slice(0, 20),
    locations: locations.slice(0, 20),
    cultureTags: cultureTags.slice(0, 15),
    salaryBands,
    keywordWeights: allKeywords,
  };

  const repoOut = resolve(__dirname, "../prisma/signals.json");
  writeFileSync(repoOut, JSON.stringify(signals, null, 2), "utf-8");
  console.log(`Wrote ${repoOut}`);

  const scraperOut = "C:/GitProject/スクレイパー製作/signals.json";
  try {
    if (!existsSync(dirname(scraperOut))) mkdirSync(dirname(scraperOut), { recursive: true });
    writeFileSync(scraperOut, JSON.stringify(signals, null, 2), "utf-8");
    console.log(`Wrote ${scraperOut}`);
  } catch (e) {
    console.warn(`Could not write to scraper dir: ${e}`);
  }

  console.log("\nSummary:");
  console.log(`  events: swipes=${totalSwipes} (likes=${likes}, skips=${skips}) favorites=${favorites.length} apps=${applications.length}`);
  if (industries[0]) console.log(`  top industry: ${industries[0].name} (score=${industries[0].score.toFixed(2)})`);
  if (locations[0]) console.log(`  top location: ${locations[0].name} (score=${locations[0].score.toFixed(2)})`);
  console.log(`  next-scrape keywords (weighted random):`);
  for (const k of signals.keywordWeights) {
    console.log(`    [${k.weight.toFixed(2)}] ${k.keyword}  — ${k.reason}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
