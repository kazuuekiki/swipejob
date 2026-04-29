/**
 * CompanyPoster — auto-generates a unique SVG poster for each company card.
 *
 * Inputs: industry, location, name, culture tags, logoColor.
 * Output: A self-contained SVG with an industry-themed illustration,
 *         abstract background, company info chips, and visual identity.
 *
 * No external image generation; everything is procedurally drawn.
 */

import React from "react";

interface PosterCompany {
  id?: number;
  companyName: string;
  profile: {
    catchphrase?: string;
    industry?: string;
    location?: string;
    culture?: string;
    logoColor?: string;
  } | null;
}

type IndustryCategory =
  | "manufacturing"
  | "construction"
  | "tech"
  | "food"
  | "medical"
  | "logistics"
  | "retail"
  | "agri"
  | "finance"
  | "realestate"
  | "education"
  | "service";

/**
 * Map a free-form industry string (Japanese) to a category.
 * Order matters — more specific keywords are checked first.
 */
function classifyIndustry(industry: string, name: string): IndustryCategory {
  const t = `${industry} ${name}`;

  if (/(IT|ソフト|ソフトウェア|情報処理|システム|エンジニア|ウェブ|Web|アプリ|テック|デジタル)/i.test(t))
    return "tech";
  if (/(医療|病院|福祉|介護|薬局|歯科|看護)/i.test(t)) return "medical";
  if (/(運送|物流|運輸|倉庫|配送|トラック|タクシー|タイヤ|自動車卸)/i.test(t))
    return "logistics";
  if (/(建設|建築|土木|工事|舗装|電気工事|管工事|設備)/i.test(t)) return "construction";
  if (/(飲食|レストラン|食品|食堂|惣菜|パン|菓子|ベーカリー|畜産|水産|食肉)/i.test(t))
    return "food";
  if (/(農業|林業|漁業|園芸|畜産農業|農場)/i.test(t)) return "agri";
  if (/(小売|卸売|販売|商店|スーパー|百貨|商社)/i.test(t)) return "retail";
  if (/(銀行|金融|保険|証券|信用金庫|信用組合)/i.test(t)) return "finance";
  if (/(不動産|住宅|賃貸|建売)/i.test(t)) return "realestate";
  if (/(教育|学校|塾|保育|幼稚園|スクール)/i.test(t)) return "education";
  if (
    /(製造|工場|加工|機械|金属|プラスチック|電子|部品|素材|採石|採取|化学|繊維)/i.test(
      t
    )
  )
    return "manufacturing";
  return "service";
}

/**
 * Visual palette per industry — uses logoColor as accent on top of a category-themed gradient.
 */
const PALETTES: Record<
  IndustryCategory,
  { from: string; to: string; bg: string; sub: string; label: string; emoji: string }
> = {
  manufacturing: {
    from: "#1e3a5f",
    to: "#2c5282",
    bg: "#0f1f33",
    sub: "#4299e1",
    label: "MANUFACTURING",
    emoji: "🏭",
  },
  construction: {
    from: "#7c5e10",
    to: "#a47816",
    bg: "#3d2e08",
    sub: "#f6ad3e",
    label: "CONSTRUCTION",
    emoji: "🏗️",
  },
  tech: {
    from: "#1a365d",
    to: "#2b6cb0",
    bg: "#0a1929",
    sub: "#63b3ed",
    label: "TECHNOLOGY",
    emoji: "💻",
  },
  food: {
    from: "#9b2c2c",
    to: "#c53030",
    bg: "#4a1717",
    sub: "#fc8181",
    label: "FOOD & BEVERAGE",
    emoji: "🍱",
  },
  medical: {
    from: "#234e52",
    to: "#2c7a7b",
    bg: "#0f2628",
    sub: "#4fd1c5",
    label: "HEALTHCARE",
    emoji: "🏥",
  },
  logistics: {
    from: "#2d3748",
    to: "#4a5568",
    bg: "#171c25",
    sub: "#a0aec0",
    label: "LOGISTICS",
    emoji: "🚚",
  },
  retail: {
    from: "#702459",
    to: "#97266d",
    bg: "#3a1230",
    sub: "#ed64a6",
    label: "RETAIL",
    emoji: "🛍️",
  },
  agri: {
    from: "#22543d",
    to: "#2f855a",
    bg: "#0f2a1d",
    sub: "#68d391",
    label: "AGRICULTURE",
    emoji: "🌾",
  },
  finance: {
    from: "#1a202c",
    to: "#2d3748",
    bg: "#0d1117",
    sub: "#cbd5e0",
    label: "FINANCE",
    emoji: "🏦",
  },
  realestate: {
    from: "#553c9a",
    to: "#6b46c1",
    bg: "#2a1d4d",
    sub: "#b794f4",
    label: "REAL ESTATE",
    emoji: "🏘️",
  },
  education: {
    from: "#744210",
    to: "#975a16",
    bg: "#3a2108",
    sub: "#f6ad55",
    label: "EDUCATION",
    emoji: "📚",
  },
  service: {
    from: "#2774AE",
    to: "#1f5d8a",
    bg: "#0f3554",
    sub: "#90cdf4",
    label: "SERVICE",
    emoji: "✨",
  },
};

/**
 * Industry-specific SVG illustrations. All are designed for a 400x400 viewBox,
 * top-half centered, single-color (currentColor) so they tint with the palette.
 */
function IndustryIllustration({ category }: { category: IndustryCategory }) {
  switch (category) {
    case "manufacturing":
      return (
        <g>
          {/* Factory silhouette */}
          <path
            d="M 80 280 L 80 200 L 130 230 L 130 180 L 200 220 L 200 160 L 280 200 L 280 280 Z"
            fill="currentColor"
            opacity="0.35"
          />
          {/* Smoke stacks */}
          <rect x="220" y="120" width="14" height="80" fill="currentColor" opacity="0.5" />
          <rect x="245" y="100" width="14" height="100" fill="currentColor" opacity="0.5" />
          {/* Smoke puffs */}
          <circle cx="227" cy="100" r="14" fill="currentColor" opacity="0.2" />
          <circle cx="252" cy="80" r="16" fill="currentColor" opacity="0.2" />
          <circle cx="240" cy="60" r="12" fill="currentColor" opacity="0.15" />
          {/* Windows */}
          <rect x="140" y="200" width="10" height="10" fill="currentColor" opacity="0.6" />
          <rect x="160" y="200" width="10" height="10" fill="currentColor" opacity="0.6" />
          <rect x="210" y="180" width="10" height="10" fill="currentColor" opacity="0.6" />
          <rect x="230" y="220" width="10" height="10" fill="currentColor" opacity="0.6" />
        </g>
      );
    case "construction":
      return (
        <g>
          {/* Crane */}
          <rect x="180" y="100" width="6" height="180" fill="currentColor" opacity="0.5" />
          <rect x="100" y="110" width="120" height="6" fill="currentColor" opacity="0.5" />
          <line x1="120" y1="116" x2="183" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <line x1="160" y1="116" x2="183" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <rect x="105" y="116" width="14" height="22" fill="currentColor" opacity="0.5" />
          {/* Building under construction */}
          <rect x="220" y="180" width="80" height="100" fill="currentColor" opacity="0.3" />
          <line x1="220" y1="200" x2="300" y2="200" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="220" y1="220" x2="300" y2="220" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="220" y1="240" x2="300" y2="240" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="240" y1="180" x2="240" y2="280" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="260" y1="180" x2="260" y2="280" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <line x1="280" y1="180" x2="280" y2="280" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        </g>
      );
    case "tech":
      return (
        <g>
          {/* Code brackets */}
          <text
            x="200"
            y="220"
            fontSize="180"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.4"
            fontWeight="700"
          >
            {"{ }"}
          </text>
          {/* Circuit dots */}
          <circle cx="100" cy="120" r="4" fill="currentColor" opacity="0.5" />
          <circle cx="130" cy="100" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="290" cy="100" r="4" fill="currentColor" opacity="0.5" />
          <circle cx="310" cy="130" r="3" fill="currentColor" opacity="0.5" />
          <line x1="100" y1="120" x2="130" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="290" y1="100" x2="310" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </g>
      );
    case "food":
      return (
        <g>
          {/* Bowl */}
          <ellipse cx="200" cy="240" rx="80" ry="20" fill="currentColor" opacity="0.4" />
          <path
            d="M 120 240 Q 200 290 280 240 L 280 240 Q 200 280 120 240 Z"
            fill="currentColor"
            opacity="0.35"
          />
          {/* Steam */}
          <path
            d="M 170 200 Q 165 180 175 165 Q 180 150 170 130"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M 200 195 Q 195 175 205 160 Q 210 145 200 125"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M 230 200 Q 225 180 235 165 Q 240 150 230 130"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
          {/* Chopsticks */}
          <line x1="290" y1="170" x2="320" y2="260" stroke="currentColor" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
          <line x1="300" y1="170" x2="330" y2="260" stroke="currentColor" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
        </g>
      );
    case "medical":
      return (
        <g>
          {/* Cross */}
          <rect x="180" y="120" width="40" height="160" rx="6" fill="currentColor" opacity="0.45" />
          <rect x="120" y="180" width="160" height="40" rx="6" fill="currentColor" opacity="0.45" />
          {/* Heartbeat line */}
          <path
            d="M 60 290 L 100 290 L 110 270 L 125 310 L 140 250 L 155 290 L 340 290"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
        </g>
      );
    case "logistics":
      return (
        <g>
          {/* Truck */}
          <rect x="80" y="180" width="140" height="80" rx="4" fill="currentColor" opacity="0.4" />
          <path
            d="M 220 200 L 280 200 L 320 230 L 320 260 L 220 260 Z"
            fill="currentColor"
            opacity="0.35"
          />
          <rect x="245" y="210" width="40" height="25" fill="currentColor" opacity="0.6" />
          {/* Wheels */}
          <circle cx="120" cy="270" r="14" fill="currentColor" opacity="0.5" />
          <circle cx="120" cy="270" r="6" fill="currentColor" opacity="0.8" />
          <circle cx="240" cy="270" r="14" fill="currentColor" opacity="0.5" />
          <circle cx="240" cy="270" r="6" fill="currentColor" opacity="0.8" />
          <circle cx="290" cy="270" r="14" fill="currentColor" opacity="0.5" />
          <circle cx="290" cy="270" r="6" fill="currentColor" opacity="0.8" />
        </g>
      );
    case "retail":
      return (
        <g>
          {/* Shopping bag */}
          <path
            d="M 130 180 L 270 180 L 285 290 L 115 290 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M 165 180 Q 165 130 200 130 Q 235 130 235 180"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          />
          <circle cx="160" cy="220" r="6" fill="currentColor" opacity="0.7" />
          <circle cx="240" cy="220" r="6" fill="currentColor" opacity="0.7" />
        </g>
      );
    case "agri":
      return (
        <g>
          {/* Wheat / leaves */}
          <path
            d="M 200 290 L 200 130"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.5"
            strokeLinecap="round"
          />
          <ellipse cx="180" cy="180" rx="10" ry="20" fill="currentColor" opacity="0.5" transform="rotate(-25 180 180)" />
          <ellipse cx="220" cy="180" rx="10" ry="20" fill="currentColor" opacity="0.5" transform="rotate(25 220 180)" />
          <ellipse cx="170" cy="220" rx="10" ry="20" fill="currentColor" opacity="0.5" transform="rotate(-30 170 220)" />
          <ellipse cx="230" cy="220" rx="10" ry="20" fill="currentColor" opacity="0.5" transform="rotate(30 230 220)" />
          <ellipse cx="160" cy="260" rx="10" ry="20" fill="currentColor" opacity="0.5" transform="rotate(-35 160 260)" />
          <ellipse cx="240" cy="260" rx="10" ry="20" fill="currentColor" opacity="0.5" transform="rotate(35 240 260)" />
          <circle cx="200" cy="135" r="14" fill="currentColor" opacity="0.5" />
        </g>
      );
    case "finance":
      return (
        <g>
          {/* Bar chart + coin */}
          <rect x="100" y="240" width="30" height="50" fill="currentColor" opacity="0.4" />
          <rect x="140" y="200" width="30" height="90" fill="currentColor" opacity="0.5" />
          <rect x="180" y="170" width="30" height="120" fill="currentColor" opacity="0.55" />
          <rect x="220" y="140" width="30" height="150" fill="currentColor" opacity="0.6" />
          <circle cx="290" cy="170" r="32" fill="currentColor" opacity="0.5" />
          <text x="290" y="180" fontSize="32" textAnchor="middle" fill="currentColor" opacity="0.9" fontWeight="700">¥</text>
        </g>
      );
    case "realestate":
      return (
        <g>
          {/* Houses */}
          <path
            d="M 100 230 L 160 180 L 220 230 L 220 290 L 100 290 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <rect x="140" y="240" width="20" height="50" fill="currentColor" opacity="0.7" />
          <rect x="175" y="240" width="20" height="20" fill="currentColor" opacity="0.6" />
          <path
            d="M 230 250 L 270 220 L 310 250 L 310 290 L 230 290 Z"
            fill="currentColor"
            opacity="0.35"
          />
          <rect x="260" y="260" width="14" height="30" fill="currentColor" opacity="0.7" />
        </g>
      );
    case "education":
      return (
        <g>
          {/* Book + cap */}
          <path
            d="M 80 200 L 200 160 L 320 200 L 200 240 Z"
            fill="currentColor"
            opacity="0.45"
          />
          <line x1="320" y1="200" x2="320" y2="240" stroke="currentColor" strokeWidth="3" opacity="0.5" />
          <line x1="320" y1="240" x2="305" y2="245" stroke="currentColor" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
          <rect x="100" y="240" width="200" height="40" fill="currentColor" opacity="0.35" />
          <rect x="100" y="280" width="200" height="6" fill="currentColor" opacity="0.55" />
        </g>
      );
    default: // service
      return (
        <g>
          {/* Abstract sparkles */}
          <circle cx="200" cy="190" r="60" fill="currentColor" opacity="0.2" />
          <circle cx="200" cy="190" r="40" fill="currentColor" opacity="0.3" />
          <circle cx="200" cy="190" r="22" fill="currentColor" opacity="0.5" />
          <path
            d="M 130 130 L 138 150 L 158 154 L 142 168 L 146 188 L 130 178 L 114 188 L 118 168 L 102 154 L 122 150 Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M 290 130 L 296 144 L 310 148 L 298 158 L 302 172 L 290 164 L 278 172 L 282 158 L 270 148 L 284 144 Z"
            fill="currentColor"
            opacity="0.5"
          />
          <path
            d="M 290 240 L 295 252 L 308 255 L 298 263 L 301 276 L 290 269 L 279 276 L 282 263 L 272 255 L 285 252 Z"
            fill="currentColor"
            opacity="0.4"
          />
        </g>
      );
  }
}

/**
 * Hash a string into a stable number — used to vary background patterns
 * deterministically per-company so each card looks distinct.
 */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function CompanyPoster({ company }: { company: PosterCompany }) {
  const profile = company.profile || {};
  const industry = profile.industry || "";
  const category = classifyIndustry(industry, company.companyName);
  const palette = PALETTES[category];
  const accent = profile.logoColor || palette.sub;
  const seed = hash(company.companyName);

  // Background pattern offset (deterministic per company)
  const dot1 = (seed % 60) - 30;
  const dot2 = ((seed >> 4) % 60) - 30;
  const stripeAngle = (seed % 40) - 20;

  // First character / kanji of company name
  const initial = company.companyName.replace(/(株式会社|有限会社|合同会社|合資会社|\(株\)|\(有\))/g, "")
    .trim()
    .charAt(0) || company.companyName.charAt(0);

  // Industry display label (short)
  const industryShort = industry.split(/[、,]/)[0]?.trim().slice(0, 12) || "";

  return (
    <svg
      viewBox="0 0 400 480"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
      role="img"
      aria-label={`${company.companyName} ポスター`}
    >
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>
        <radialGradient id={`spot-${seed}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <pattern id={`dots-${seed}`} x={dot1} y={dot2} width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1.5" fill="white" opacity="0.18" />
        </pattern>
      </defs>

      {/* Base gradient */}
      <rect width="400" height="480" fill={`url(#bg-${seed})`} />

      {/* Dot grid pattern */}
      <rect width="400" height="480" fill={`url(#dots-${seed})`} />

      {/* Diagonal accent stripe */}
      <g transform={`rotate(${stripeAngle} 200 240)`}>
        <rect x="-60" y="380" width="540" height="60" fill={accent} opacity="0.15" />
        <rect x="-60" y="60" width="540" height="6" fill={accent} opacity="0.25" />
      </g>

      {/* Soft spotlight */}
      <rect width="400" height="480" fill={`url(#spot-${seed})`} />

      {/* Industry illustration */}
      <g style={{ color: accent }}>
        <IndustryIllustration category={category} />
      </g>

      {/* Top-left industry tag */}
      <g>
        <rect
          x="20"
          y="20"
          width={Math.max(110, palette.label.length * 7 + 30)}
          height="26"
          rx="13"
          fill="white"
          fillOpacity="0.12"
        />
        <text x="34" y="38" fontSize="11" letterSpacing="1.5" fill="white" fillOpacity="0.85" fontWeight="700" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
          {palette.emoji} {palette.label}
        </text>
      </g>

      {/* Top-right location pill */}
      {profile.location && (
        <g>
          <rect
            x={400 - (profile.location.length * 11 + 30)}
            y="20"
            width={profile.location.length * 11 + 14}
            height="26"
            rx="13"
            fill="white"
            fillOpacity="0.16"
          />
          <text
            x={400 - 22}
            y="38"
            fontSize="12"
            textAnchor="end"
            fill="white"
            fillOpacity="0.95"
            fontWeight="600"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif"
          >
            📍 {profile.location}
          </text>
        </g>
      )}

      {/* Big initial / first kanji as background watermark */}
      <text
        x="200"
        y="350"
        fontSize="240"
        textAnchor="middle"
        fill="white"
        fillOpacity="0.07"
        fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Yu Gothic', sans-serif"
      >
        {initial}
      </text>

      {/* Bottom band with company info */}
      <g>
        <rect x="0" y="380" width="400" height="100" fill="black" fillOpacity="0.25" />
        {/* Industry detail */}
        {industryShort && (
          <text
            x="24"
            y="408"
            fontSize="11"
            fill={accent}
            fontWeight="700"
            letterSpacing="1"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif"
          >
            {industryShort.toUpperCase()}
          </text>
        )}
        {/* Company name */}
        <text
          x="24"
          y="438"
          fontSize="22"
          fill="white"
          fontWeight="800"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Yu Gothic', sans-serif"
        >
          {company.companyName.length > 18
            ? company.companyName.slice(0, 17) + "…"
            : company.companyName}
        </text>
        {/* Catchphrase if available */}
        {profile.catchphrase && (
          <text
            x="24"
            y="460"
            fontSize="11"
            fill="white"
            fillOpacity="0.7"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif"
          >
            {profile.catchphrase.length > 36
              ? profile.catchphrase.slice(0, 35) + "…"
              : profile.catchphrase}
          </text>
        )}
      </g>
    </svg>
  );
}
