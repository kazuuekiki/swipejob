/**
 * Smoke test for the signals pipeline. Builds an in-memory dataset of
 * synthetic swipes/favorites/applications, runs the same aggregation
 * logic export-signals.ts uses, and asserts the output looks sane.
 *
 * Does NOT touch the database. Run with: tsx scripts/smoke-test-signals.ts
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

const WEIGHT_SWIPE_LIKE = 1.0;
const WEIGHT_FAVORITE = 2.0;
const WEIGHT_APPLY = 3.0;
const HALF_LIFE_DAYS = 30;
const SIGNAL_KEYWORD_CAP = 0.6;
const BASE_KEYWORD_FLOOR = 0.4;

function decay(date: Date, now: number) {
  const ageDays = (now - date.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return 1;
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
}

function bandFor(annual: number) {
  if (annual < 250) return "<250万";
  if (annual < 350) return "250-350万";
  if (annual < 450) return "350-450万";
  if (annual < 600) return "450-600万";
  return "600万+";
}

function prefectureOf(loc: string) {
  const m = loc.match(/^(東京都|北海道|(?:京都|大阪)府|.+?県)/);
  return m ? m[1] : "";
}

interface Profile {
  companyId: number;
  industry: string;
  location: string;
  culture: string;
  annualMan: number;
}

interface Event {
  companyId: number;
  type: "swipe-like" | "swipe-skip" | "favorite" | "apply";
  date: Date;
}

// ---- Synthetic dataset ----
// 5 companies: 3 in Tokyo IT (popular), 2 in regional manufacturing (less popular)
const profiles: Profile[] = [
  { companyId: 1, industry: "情報通信業", location: "東京都港区", culture: "成長志向,技術重視", annualMan: 320 },
  { companyId: 2, industry: "情報通信業", location: "東京都新宿区", culture: "成長志向,自由な働き方", annualMan: 380 },
  { companyId: 3, industry: "情報通信業", location: "東京都渋谷区", culture: "技術重視,成長志向", annualMan: 290 },
  { companyId: 4, industry: "製造業", location: "愛知県豊田市", culture: "安定志向,アットホーム", annualMan: 240 },
  { companyId: 5, industry: "製造業", location: "栃木県宇都宮市", culture: "安定志向", annualMan: 260 },
];

const NOW = new Date("2026-04-18T00:00:00Z").getTime();
const days = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000);

const events: Event[] = [
  // Heavy positive on Tokyo IT (recent)
  { companyId: 1, type: "swipe-like", date: days(1) },
  { companyId: 1, type: "favorite",   date: days(1) },
  { companyId: 1, type: "apply",      date: days(0) },
  { companyId: 2, type: "swipe-like", date: days(2) },
  { companyId: 2, type: "favorite",   date: days(2) },
  { companyId: 3, type: "swipe-like", date: days(3) },
  // Mild interest on manufacturing (older — should decay)
  { companyId: 4, type: "swipe-like", date: days(60) },
  // Negative signals
  { companyId: 4, type: "swipe-skip", date: days(2) },
  { companyId: 5, type: "swipe-skip", date: days(2) },
  { companyId: 5, type: "swipe-skip", date: days(1) },
];

// ---- Aggregate ----
const profileById = new Map(profiles.map((p) => [p.companyId, p]));
const indBucket = new Map<string, { positive: number; negative: number }>();
const locBucket = new Map<string, { positive: number; negative: number }>();

function bump(map: Map<string, { positive: number; negative: number }>, key: string, w: number, neg: boolean) {
  const b = map.get(key) || { positive: 0, negative: 0 };
  if (neg) b.negative += w; else b.positive += w;
  map.set(key, b);
}

for (const e of events) {
  const p = profileById.get(e.companyId);
  if (!p) continue;
  const baseW = e.type === "apply" ? WEIGHT_APPLY : e.type === "favorite" ? WEIGHT_FAVORITE : WEIGHT_SWIPE_LIKE;
  const w = baseW * decay(e.date, NOW);
  const isNeg = e.type === "swipe-skip";
  const ind = p.industry;
  const loc = prefectureOf(p.location);
  bump(indBucket, ind, w, isNeg);
  if (loc) bump(locBucket, loc, w, isNeg);
}

function rank(m: Map<string, { positive: number; negative: number }>) {
  return [...m.entries()]
    .map(([name, v]) => {
      const total = v.positive + v.negative;
      const rate = total > 0 ? v.positive / total : 0;
      return { name, score: rate * Math.log1p(total), positive: v.positive, negative: v.negative };
    })
    .sort((a, b) => b.score - a.score);
}

const industries = rank(indBucket);
const locations = rank(locBucket);

// ---- Assertions ----
let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { console.error(`  FAIL: ${msg}`); failed++; }
  else console.log(`  PASS: ${msg}`);
}

console.log("=== Smoke test: signal aggregation ===");
assert(industries[0].name === "情報通信業", "情報通信業 ranks first (highest engagement)");
assert(locations[0].name === "東京都", "東京都 ranks first (most likes/applies)");
assert(industries[0].positive > industries[0].negative * 5, "情報通信業 has overwhelmingly positive signal");

const mfg = industries.find((i) => i.name === "製造業")!;
assert(mfg.negative > mfg.positive, "製造業 net negative (more skips than likes)");

const oldEvent = WEIGHT_SWIPE_LIKE * decay(days(60), NOW);
assert(oldEvent < 0.3, `60-day-old like decayed to <0.3 (got ${oldEvent.toFixed(3)})`);

// Build keywords
const baseKeywords = [
  { keyword: "高卒", weight: Math.max(BASE_KEYWORD_FLOOR, 1.0), reason: "primary" },
  { keyword: "学歴不問", weight: Math.max(BASE_KEYWORD_FLOOR, 0.6), reason: "fallback" },
];
const signalKeywords = [
  { keyword: `高卒 ${locations[0].name}`, weight: Math.min(SIGNAL_KEYWORD_CAP, locations[0].score), reason: "loc" },
  { keyword: `高卒 ${industries[0].name}`, weight: Math.min(SIGNAL_KEYWORD_CAP, industries[0].score), reason: "ind" },
];

assert(baseKeywords[0].weight >= BASE_KEYWORD_FLOOR, "高卒 base keyword has floor");
assert(signalKeywords[0].weight <= SIGNAL_KEYWORD_CAP, "signal keyword respects cap");
assert(baseKeywords[0].weight > signalKeywords[0].weight, "base keyword 高卒 still outweighs any signal-derived keyword");

console.log("\nSimulated keyword distribution:");
const all = [...baseKeywords, ...signalKeywords].sort((a, b) => b.weight - a.weight);
for (const k of all) {
  console.log(`  [${k.weight.toFixed(2)}] ${k.keyword}  — ${k.reason}`);
}

// Write output
const out = resolve(__dirname, "../prisma/signals.smoke.json");
writeFileSync(
  out,
  JSON.stringify({ industries, locations, keywordWeights: all }, null, 2),
  "utf-8"
);
console.log(`\nWrote synthetic signals to ${out}`);

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed.`);
  process.exit(1);
}
console.log("\nAll assertions passed.");
