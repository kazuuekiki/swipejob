/**
 * Aggregate user feedback (swipes, favorites, applications) into a
 * compact JSON signal file the scraper can read to prioritize what to
 * scrape next.
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
// Add a generous connect timeout for cold-start Neon branches.
const connectionString = baseUrl.includes("connect_timeout=")
  ? baseUrl
  : baseUrl + (baseUrl.includes("?") ? "&" : "?") + "connect_timeout=30";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

interface Signals {
  generatedAt: string;
  totals: {
    swipes: number;
    likes: number;
    skips: number;
    favorites: number;
    applications: number;
  };
  industries: Array<{ name: string; likeRate: number; sample: number }>;
  locations: Array<{ name: string; likeRate: number; sample: number }>;
  cultureTags: Array<{ tag: string; likeCount: number }>;
  salaryBands: Array<{ band: string; likeRate: number; sample: number }>;
  // Keywords the scraper should prioritize. Higher weight = more likely
  // to be picked for the next scrape run.
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

async function main() {
  // ---- Pull raw events (simple separate queries to avoid long joins) ----
  const [rawSwipes, profiles, favorites, applications] = await Promise.all([
    prisma.swipe.findMany({ select: { action: true, companyId: true } }),
    prisma.companyProfile.findMany({
      select: { companyId: true, industry: true, location: true, culture: true, annualSalary: true },
    }),
    prisma.favorite.findMany({ select: { companyId: true } }),
    prisma.application.findMany({ select: { companyId: true } }),
  ]);
  const profileById = new Map(profiles.map((p) => [p.companyId, p]));
  const swipes = rawSwipes.map((s) => ({
    action: s.action,
    company: { profile: profileById.get(s.companyId) || null },
  }));

  const totalSwipes = swipes.length;
  const likes = swipes.filter((s) => s.action === "like").length;
  const skips = swipes.filter((s) => s.action === "skip").length;

  // ---- Aggregate by industry ----
  const indStats = new Map<string, { like: number; skip: number }>();
  const locStats = new Map<string, { like: number; skip: number }>();
  const cultureLikes = new Map<string, number>();
  const salaryStats = new Map<string, { like: number; skip: number }>();

  for (const s of swipes) {
    const p = (s as any).company?.profile;
    if (!p) continue;
    const ind = p.industry || "その他";
    const loc = prefectureOf(p.location || "") || "不明";
    const culture = (p.culture || "").split(",").map((t: string) => t.trim()).filter(Boolean);
    const annual = parseAnnualMan(p.annualSalary || "");
    const band = annual ? bandFor(annual) : "";

    const indEntry = indStats.get(ind) || { like: 0, skip: 0 };
    const locEntry = locStats.get(loc) || { like: 0, skip: 0 };
    const salEntry = band ? salaryStats.get(band) || { like: 0, skip: 0 } : null;

    if (s.action === "like") {
      indEntry.like++;
      locEntry.like++;
      if (salEntry) salEntry.like++;
      for (const c of culture) cultureLikes.set(c, (cultureLikes.get(c) || 0) + 1);
    } else {
      indEntry.skip++;
      locEntry.skip++;
      if (salEntry) salEntry.skip++;
    }

    indStats.set(ind, indEntry);
    locStats.set(loc, locEntry);
    if (salEntry && band) salaryStats.set(band, salEntry);
  }

  function rank<T extends { like: number; skip: number }>(
    m: Map<string, T>,
    minSample = 1,
  ): Array<{ name: string; likeRate: number; sample: number }> {
    return [...m.entries()]
      .map(([name, v]) => ({ name, likeRate: v.like / (v.like + v.skip || 1), sample: v.like + v.skip }))
      .filter((e) => e.sample >= minSample)
      .sort((a, b) => b.likeRate * Math.log(1 + b.sample) - a.likeRate * Math.log(1 + a.sample));
  }

  const industries = rank(indStats);
  const locations = rank(locStats);
  const salaryBands = rank(salaryStats).map((e) => ({ band: e.name, likeRate: e.likeRate, sample: e.sample }));
  const cultureTags = [...cultureLikes.entries()]
    .map(([tag, likeCount]) => ({ tag, likeCount }))
    .sort((a, b) => b.likeCount - a.likeCount);

  // ---- Build keyword weights for the scraper ----
  // Default Japan-wide weighted keywords for our target audience.
  const baseKeywords = [
    { keyword: "高卒", weight: 1.0, reason: "primary target audience" },
    { keyword: "学歴不問", weight: 0.8, reason: "captures inclusive jobs" },
    { keyword: "未経験歓迎", weight: 0.6, reason: "captures entry-level" },
  ];
  // Boost a regional keyword if a prefecture is dominant in likes.
  const topLoc = locations[0];
  if (topLoc && topLoc.sample >= 5 && topLoc.likeRate >= 0.5 && topLoc.name !== "不明") {
    baseKeywords.push({
      keyword: `高卒 ${topLoc.name}`,
      weight: 0.7 + topLoc.likeRate * 0.5,
      reason: `users prefer ${topLoc.name} (likeRate=${topLoc.likeRate.toFixed(2)}, n=${topLoc.sample})`,
    });
  }
  // Boost an industry keyword similarly.
  const topInd = industries[0];
  if (topInd && topInd.sample >= 5 && topInd.likeRate >= 0.5) {
    baseKeywords.push({
      keyword: `高卒 ${topInd.name}`,
      weight: 0.7 + topInd.likeRate * 0.5,
      reason: `users prefer ${topInd.name} industry (likeRate=${topInd.likeRate.toFixed(2)}, n=${topInd.sample})`,
    });
  }

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
    keywordWeights: baseKeywords.sort((a, b) => b.weight - a.weight),
  };

  // ---- Write to repo and to scraper dir ----
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

  console.log("Summary:");
  console.log(`  swipes=${totalSwipes} (likes=${likes}, skips=${skips})`);
  console.log(`  top industry: ${industries[0]?.name || "(none)"} `);
  console.log(`  top location: ${locations[0]?.name || "(none)"}`);
  console.log(`  next-scrape keywords:`);
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
