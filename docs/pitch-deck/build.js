const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.author = "JobSwipe";
pres.title = "JobSwipe — A matching app for the underserved majority";

// ---------- Palette ----------
const NAVY = "2774AE";
const NAVY_DARK = "1F5D8A";
const GOLD = "FFD100";
const BG = "FAFAFA";
const INK = "1F2937";
const MUTED = "64748B";
const LINE = "E5E7EB";
const WHITE = "FFFFFF";

const FONT_HEADER = "Georgia";
const FONT_BODY = "Calibri";

const shadow = () => ({
  type: "outer", color: "000000", blur: 12, offset: 3, angle: 90, opacity: 0.1,
});

function addPageNumber(slide, n, total) {
  slide.addText(`${String(n).padStart(2, "0")} / ${String(total).padStart(2, "0")}`, {
    x: 9.0, y: 5.3, w: 0.9, h: 0.25,
    fontSize: 9, fontFace: FONT_BODY, color: MUTED, align: "right",
  });
}

function addBrandChip(slide, x = 0.5, y = 0.3) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.25, h: 0.25, fill: { color: NAVY }, line: { color: NAVY },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: x + 0.08, y: y + 0.08, w: 0.09, h: 0.09, fill: { color: GOLD }, line: { color: GOLD },
  });
  slide.addText("JobSwipe", {
    x: x + 0.35, y: y - 0.02, w: 2, h: 0.3,
    fontSize: 12, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
  });
}

function addFooterBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.25, w: 10, h: 0.015, fill: { color: LINE }, line: { color: LINE },
  });
}

function addEyebrow(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 0.9, w: 6, h: 0.5,
    fontSize: 12, fontFace: FONT_BODY, bold: true, color: NAVY, charSpacing: 6, margin: 0,
  });
}

function addTitle(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.5, y: 1.25, w: opts.w || 9, h: opts.h || 0.9,
    fontSize: opts.fontSize || 30, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
  });
}

const TOTAL = 11;
let slideNum = 0;

// ========== Slide 1: Title ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 0, w: 2.8, h: 5.625, fill: { color: NAVY }, line: { color: NAVY },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2, y: 2.5, w: 2.8, h: 0.6, fill: { color: GOLD }, line: { color: GOLD },
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.6, w: 0.35, h: 0.35, fill: { color: GOLD }, line: { color: GOLD },
  });
  s.addText("JobSwipe", {
    x: 1.05, y: 0.55, w: 3, h: 0.45,
    fontSize: 16, fontFace: FONT_HEADER, bold: true, color: WHITE, margin: 0,
  });

  s.addText("A matching app for", {
    x: 0.6, y: 1.9, w: 7, h: 0.85,
    fontSize: 44, fontFace: FONT_HEADER, bold: true, color: WHITE, margin: 0,
  });
  s.addText("the underserved majority.", {
    x: 0.6, y: 2.7, w: 7, h: 0.85,
    fontSize: 44, fontFace: FONT_HEADER, bold: true, color: GOLD, margin: 0,
  });

  s.addText("A Tinder-style career app built for Japan's mid-tier university and high school graduates — the students existing platforms weren't designed for.", {
    x: 0.6, y: 3.8, w: 6.3, h: 0.9,
    fontSize: 13, fontFace: FONT_BODY, color: "CADCFC", italic: true, margin: 0,
  });

  s.addText("Concept Pitch  ·  April 2026  ·  [Your Name]", {
    x: 0.6, y: 4.9, w: 6, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: "CADCFC", charSpacing: 4, margin: 0,
  });
}

// ========== Slide 2: Observed Problem ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "The Problem I See");
  addTitle(s, "Most job-hunting tools optimize for name-brand university students.", { fontSize: 26 });

  // Three observation cards
  const cards = [
    {
      title: "Elite-brand bias",
      body: "Mainstream platforms (Mynavi, Rikunabi) surface companies that hire from name-brand universities. Mid-tier and high school students often scroll past jobs they cannot realistically get.",
    },
    {
      title: "High friction, low fit",
      body: "Long entry sheets and SPI tests cost hours per company, even when the match is poor. Students with less career support give up earlier.",
    },
    {
      title: "Opaque culture",
      body: "Cards show only title and salary. Work style, growth orientation, and team feel — what actually predicts retention — are invisible until the interview.",
    },
  ];

  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.1;
    const y = 2.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.9, h: 2.7,
      fill: { color: WHITE }, line: { color: LINE, width: 1 },
      shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.9, h: 0.08, fill: { color: NAVY }, line: { color: NAVY },
    });
    s.addText(c.title, {
      x: x + 0.25, y: y + 0.3, w: 2.5, h: 0.4,
      fontSize: 15, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(c.body, {
      x: x + 0.25, y: y + 0.75, w: 2.5, h: 1.85,
      fontSize: 11, fontFace: FONT_BODY, color: MUTED, margin: 0,
    });
  });

  s.addText("These are observations from talking to peers and reviewing public materials — not measured market research. Validation is part of the plan (slide 9).", {
    x: 0.5, y: 5.05, w: 9, h: 0.2,
    fontSize: 9, fontFace: FONT_BODY, color: MUTED, italic: true, margin: 0,
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 3: Target User ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "Target User");
  addTitle(s, "Students existing platforms overlook.", { fontSize: 30 });

  // Big bullseye-style card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.3, w: 4.3, h: 2.7,
    fill: { color: NAVY_DARK }, line: { color: NAVY_DARK },
  });
  s.addText("Who we build for", {
    x: 0.75, y: 2.45, w: 3.9, h: 0.35,
    fontSize: 11, fontFace: FONT_BODY, bold: true, color: GOLD, charSpacing: 4, margin: 0,
  });
  s.addText([
    { text: "Mid-tier and below university students", options: { bold: true, color: WHITE, breakLine: true } },
    { text: "  — non-top-tier private and regional universities", options: { color: "CADCFC", breakLine: true, fontSize: 11 } },
    { text: "High school graduates entering the workforce", options: { bold: true, color: WHITE, breakLine: true } },
    { text: "  — seeking first-time full-time employment", options: { color: "CADCFC", breakLine: true, fontSize: 11 } },
    { text: "Vocational and junior college students", options: { bold: true, color: WHITE } },
  ], {
    x: 0.75, y: 2.85, w: 3.9, h: 2.1,
    fontSize: 13, fontFace: FONT_BODY, paraSpaceAfter: 6, margin: 0,
  });

  // Right: why this segment matters
  s.addText("Why this segment", {
    x: 5.2, y: 2.35, w: 4.3, h: 0.35,
    fontSize: 11, fontFace: FONT_BODY, bold: true, color: NAVY, charSpacing: 4, margin: 0,
  });

  const reasons = [
    ["Large & underserved", "This segment represents a substantial share of Japan's new workforce entrants each year, yet most hiring UX is clearly tuned for top-tier recruiting."],
    ["Less brand gatekeeping", "Companies hiring from this pool care more about fit than pedigree — a profile-based swipe match fits their actual selection logic."],
    ["Mobile-native behavior", "This segment lives on phones. Swipe UX removes the friction that keeps them off desktop job portals."],
  ];
  reasons.forEach((r, i) => {
    const y = 2.8 + i * 0.77;
    s.addShape(pres.shapes.OVAL, {
      x: 5.2, y: y + 0.03, w: 0.24, h: 0.24,
      fill: { color: GOLD }, line: { color: GOLD },
    });
    s.addText(String(i + 1), {
      x: 5.2, y, w: 0.24, h: 0.3,
      fontSize: 11, fontFace: FONT_HEADER, bold: true, color: NAVY_DARK, align: "center", margin: 0,
    });
    s.addText(r[0], {
      x: 5.55, y: y - 0.03, w: 4.0, h: 0.3,
      fontSize: 13, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(r[1], {
      x: 5.55, y: y + 0.28, w: 4.0, h: 0.55,
      fontSize: 10, fontFace: FONT_BODY, color: MUTED, margin: 0,
    });
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 4: Solution ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "The Concept");
  addTitle(s, "Swipe, match, apply in minutes.", { fontSize: 26, w: 6.5 });
  s.addText("A mobile-first matching app where students evaluate companies on the attributes they actually care about — salary range, location, culture — and recruiters review real profiles instead of essays.",
    { x: 0.5, y: 2.05, w: 6, h: 0.95, fontSize: 12, fontFace: FONT_BODY, color: MUTED, italic: true, margin: 0 }
  );

  // Phone mockup
  const px = 7.2, py = 1.1;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px, y: py, w: 2.2, h: 3.9,
    fill: { color: "111827" }, line: { color: "111827", width: 0 }, rectRadius: 0.18,
    shadow: shadow(),
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px + 0.12, y: py + 0.12, w: 1.96, h: 3.66,
    fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.12,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: px + 0.3, y: py + 0.4, w: 1.6, h: 2.1,
    fill: { color: NAVY }, line: { color: NAVY }, rectRadius: 0.1,
  });
  s.addText("S", {
    x: px + 0.3, y: py + 0.7, w: 1.6, h: 1.5,
    fontSize: 80, fontFace: FONT_HEADER, bold: true, color: WHITE, align: "center", margin: 0,
  });
  s.addText("Sample Co., Ltd.", {
    x: px + 0.25, y: py + 2.6, w: 1.7, h: 0.3,
    fontSize: 10, fontFace: FONT_HEADER, bold: true, color: INK, align: "center", margin: 0,
  });
  s.addText("¥280〜360万 / Tokyo", {
    x: px + 0.25, y: py + 2.88, w: 1.7, h: 0.25,
    fontSize: 8, fontFace: FONT_BODY, color: NAVY, align: "center", margin: 0,
  });
  s.addShape(pres.shapes.OVAL, {
    x: px + 0.45, y: py + 3.25, w: 0.45, h: 0.45,
    fill: { color: WHITE }, line: { color: LINE, width: 1 },
  });
  s.addText("×", { x: px + 0.45, y: py + 3.23, w: 0.45, h: 0.45, fontSize: 20, fontFace: FONT_BODY, color: MUTED, align: "center", margin: 0 });
  s.addShape(pres.shapes.OVAL, {
    x: px + 1.3, y: py + 3.25, w: 0.45, h: 0.45,
    fill: { color: NAVY }, line: { color: NAVY },
  });
  s.addText("♥", { x: px + 1.3, y: py + 3.23, w: 0.45, h: 0.45, fontSize: 18, fontFace: FONT_BODY, color: GOLD, align: "center", margin: 0 });

  const bullets = [
    { title: "Swipe right", text: "to save a company to your shortlist." },
    { title: "Tap apply", text: "with a reusable profile — photo, MBTI, self-PR, resume." },
    { title: "Mutual match", text: "opens direct chat between student and recruiter." },
  ];
  bullets.forEach((b, i) => {
    const y = 3.15 + i * 0.55;
    s.addShape(pres.shapes.OVAL, { x: 0.5, y, w: 0.4, h: 0.4, fill: { color: NAVY }, line: { color: NAVY } });
    s.addText(String(i + 1), {
      x: 0.5, y: y - 0.02, w: 0.4, h: 0.4,
      fontSize: 14, fontFace: FONT_HEADER, bold: true, color: GOLD, align: "center", margin: 0,
    });
    s.addText([
      { text: b.title + " ", options: { bold: true, color: INK } },
      { text: b.text, options: { color: MUTED } },
    ], { x: 1.0, y: y + 0.02, w: 5.8, h: 0.45, fontSize: 13, fontFace: FONT_BODY, margin: 0 });
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 5: Product ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "Product Principles");
  addTitle(s, "Every feature is about reducing time-to-signal.", { fontSize: 26 });

  const feats = [
    ["Salary shown up front", "Annual range on every card. Removes the most common frustration for this segment."],
    ["Culture tags", "Each company labeled with culture attributes (work-life, growth, team, tech)."],
    ["One profile, many applications", "Photo, resume, MBTI, self-PR — reused across every company. No rewriting essays."],
    ["Smart filters", "Region, industry, minimum salary — stored in the student's settings."],
    ["In-app chat on match", "Direct conversation once both sides opt in. No recruiter-only outreach."],
    ["Progress tracker", "Amazon-style pipeline: applied → reviewing → interview → matched."],
  ];
  feats.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 3.1;
    const y = 2.35 + row * 1.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.9, h: 1.15,
      fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.08, h: 1.15, fill: { color: NAVY }, line: { color: NAVY },
    });
    s.addText(f[0], {
      x: x + 0.25, y: y + 0.15, w: 2.6, h: 0.35,
      fontSize: 13, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(f[1], {
      x: x + 0.25, y: y + 0.52, w: 2.6, h: 0.6,
      fontSize: 10, fontFace: FONT_BODY, color: MUTED, margin: 0,
    });
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 6: Business Model ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "Business Model");
  addTitle(s, "Free for students. Success-fee from companies.", { fontSize: 28 });

  const cols = [
    {
      title: "Students",
      sub: "Free, always",
      price: "¥0",
      items: [
        "Unlimited swipes",
        "Unified profile",
        "Direct chat with matched recruiters",
        "Progress tracker",
      ],
      color: NAVY,
    },
    {
      title: "Companies",
      sub: "Pay on hire only",
      price: "¥500,000",
      priceSub: "per successful hire",
      items: [
        "Post unlimited job cards",
        "Receive applications & profiles",
        "Direct messaging with candidates",
        "No monthly subscription",
      ],
      color: GOLD,
    },
  ];

  cols.forEach((c, i) => {
    const x = 0.5 + i * 4.75;
    const y = 2.3;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 2.7,
      fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 0.1, fill: { color: c.color }, line: { color: c.color },
    });
    s.addText(c.title, {
      x: x + 0.3, y: y + 0.25, w: 2.5, h: 0.4,
      fontSize: 18, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(c.sub, {
      x: x + 0.3, y: y + 0.65, w: 2.5, h: 0.3,
      fontSize: 11, fontFace: FONT_BODY, color: MUTED, italic: true, margin: 0,
    });
    s.addText(c.price, {
      x: x + 2.4, y: y + 0.3, w: 2.0, h: 0.5,
      fontSize: 22, fontFace: FONT_HEADER, bold: true, color: c.color, align: "right", margin: 0,
    });
    if (c.priceSub) {
      s.addText(c.priceSub, {
        x: x + 2.4, y: y + 0.78, w: 2.0, h: 0.3,
        fontSize: 9, fontFace: FONT_BODY, color: MUTED, align: "right", margin: 0,
      });
    }
    s.addText(
      c.items.map((t, idx) => ({ text: t, options: { bullet: true, breakLine: idx !== c.items.length - 1 } })),
      { x: x + 0.3, y: y + 1.15, w: 4.0, h: 1.5, fontSize: 11, fontFace: FONT_BODY, color: INK, paraSpaceAfter: 4, margin: 0 }
    );
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 7: Competitive Landscape ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "Competitive Landscape");
  addTitle(s, "Positioned where incumbents don't compete.", { fontSize: 28 });

  // 2x2 positioning map
  const mapX = 0.5, mapY = 2.3, mapW = 5.0, mapH = 2.7;
  s.addShape(pres.shapes.RECTANGLE, {
    x: mapX, y: mapY, w: mapW, h: mapH,
    fill: { color: WHITE }, line: { color: LINE, width: 1 },
  });
  // Axes
  s.addShape(pres.shapes.LINE, {
    x: mapX + mapW / 2, y: mapY, w: 0, h: mapH,
    line: { color: LINE, width: 1, dashType: "dash" },
  });
  s.addShape(pres.shapes.LINE, {
    x: mapX, y: mapY + mapH / 2, w: mapW, h: 0,
    line: { color: LINE, width: 1, dashType: "dash" },
  });
  // Axis labels
  s.addText("Top-tier focus →", { x: mapX + mapW / 2, y: mapY + mapH + 0.02, w: mapW / 2, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: MUTED, align: "right", margin: 0 });
  s.addText("← Mid/lower-tier focus", { x: mapX, y: mapY + mapH + 0.02, w: mapW / 2, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: MUTED, align: "left", margin: 0 });
  s.addText("Low-friction UX", { x: mapX - 0.4, y: mapY, w: 0.38, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: MUTED, align: "right", margin: 0 });
  s.addText("High-friction UX", { x: mapX - 0.4, y: mapY + mapH - 0.3, w: 0.38, h: 0.3, fontSize: 9, fontFace: FONT_BODY, color: MUTED, align: "right", margin: 0 });

  // Plot points
  function dot(xPct, yPct, label, color, isUs) {
    const x = mapX + mapW * xPct;
    const y = mapY + mapH * yPct;
    s.addShape(pres.shapes.OVAL, {
      x: x - 0.12, y: y - 0.12, w: 0.24, h: 0.24,
      fill: { color }, line: { color: isUs ? NAVY_DARK : color, width: isUs ? 2 : 0 },
    });
    s.addText(label, {
      x: x + 0.15, y: y - 0.15, w: 1.6, h: 0.3,
      fontSize: 10, fontFace: FONT_BODY, bold: isUs, color: INK, margin: 0,
    });
  }
  dot(0.78, 0.75, "Mynavi / Rikunabi", MUTED, false);
  dot(0.88, 0.35, "LinkedIn", MUTED, false);
  dot(0.15, 0.85, "Hello Work", MUTED, false);
  dot(0.2, 0.2, "JobSwipe", GOLD, true);

  // Right: three bullets
  s.addText("Where JobSwipe fits", {
    x: 6.0, y: 2.35, w: 3.5, h: 0.35,
    fontSize: 11, fontFace: FONT_BODY, bold: true, color: NAVY, charSpacing: 4, margin: 0,
  });
  const points = [
    ["Mid/lower-tier focus", "Mynavi and Rikunabi have volume but reward elite-school signal; LinkedIn skews mid-career."],
    ["Mobile-first, swipe UX", "Hello Work and public listings are text-heavy and desktop-era. This segment lives on phones."],
    ["Success-fee only", "No upfront cost to companies lowers the barrier for SMBs who hire this segment."],
  ];
  points.forEach((p, i) => {
    const y = 2.75 + i * 0.75;
    s.addText(p[0], {
      x: 6.0, y, w: 3.8, h: 0.3,
      fontSize: 13, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(p[1], {
      x: 6.0, y: y + 0.3, w: 3.8, h: 0.5,
      fontSize: 10, fontFace: FONT_BODY, color: MUTED, margin: 0,
    });
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 8: Current Status ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "Current Status");
  addTitle(s, "Working prototype. Not yet launched.", { fontSize: 28 });

  // Status bar
  const steps = [
    { t: "Concept", done: true },
    { t: "Prototype", done: true },
    { t: "Closed beta", done: false },
    { t: "Public launch", done: false },
    { t: "First paying hire", done: false },
  ];
  const barX = 0.5, barY = 2.3, barW = 9;
  const gap = barW / (steps.length - 1);
  s.addShape(pres.shapes.LINE, {
    x: barX, y: barY + 0.18, w: barW, h: 0, line: { color: LINE, width: 2 },
  });
  steps.forEach((st, i) => {
    const x = barX + gap * i;
    s.addShape(pres.shapes.OVAL, {
      x: x - 0.12, y: barY + 0.06, w: 0.24, h: 0.24,
      fill: { color: st.done ? GOLD : WHITE },
      line: { color: st.done ? NAVY_DARK : LINE, width: 2 },
    });
    s.addText(st.t, {
      x: x - 0.9, y: barY + 0.45, w: 1.8, h: 0.35,
      fontSize: 11, fontFace: FONT_BODY, bold: st.done, color: st.done ? INK : MUTED, align: "center", margin: 0,
    });
  });

  // Built so far / Not yet
  const leftX = 0.5, rightX = 5.2;
  const colY = 3.4, colH = 1.6;

  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: colY, w: 4.3, h: colH,
    fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: leftX, y: colY, w: 0.08, h: colH, fill: { color: NAVY }, line: { color: NAVY },
  });
  s.addText("Built so far", {
    x: leftX + 0.25, y: colY + 0.15, w: 3.9, h: 0.3,
    fontSize: 13, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
  });
  s.addText([
    { text: "Swipe card UI (web, mobile-optimized)", options: { bullet: true, breakLine: true } },
    { text: "Student profile with photo, resume, MBTI", options: { bullet: true, breakLine: true } },
    { text: "Favorites, apply, chat, progress tracker", options: { bullet: true, breakLine: true } },
    { text: "Region / industry / salary filters", options: { bullet: true } },
  ], {
    x: leftX + 0.25, y: colY + 0.5, w: 3.9, h: 1.0,
    fontSize: 10, fontFace: FONT_BODY, color: INK, paraSpaceAfter: 3, margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: colY, w: 4.3, h: colH,
    fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shadow(),
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: colY, w: 0.08, h: colH, fill: { color: GOLD }, line: { color: GOLD },
  });
  s.addText("Not yet", {
    x: rightX + 0.25, y: colY + 0.15, w: 3.9, h: 0.3,
    fontSize: 13, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
  });
  s.addText([
    { text: "No real users — app has not been released", options: { bullet: true, breakLine: true } },
    { text: "No signed company partnerships", options: { bullet: true, breakLine: true } },
    { text: "No validated demand data", options: { bullet: true, breakLine: true } },
    { text: "Native iOS / Android apps not built", options: { bullet: true } },
  ], {
    x: rightX + 0.25, y: colY + 0.5, w: 3.9, h: 1.0,
    fontSize: 10, fontFace: FONT_BODY, color: INK, paraSpaceAfter: 3, margin: 0,
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 9: Validation Plan ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "What I Need to Learn");
  addTitle(s, "Three hypotheses to test before scaling.", { fontSize: 28 });

  const hyps = [
    {
      h: "H1. Students want this",
      test: "Show the prototype to 30 students at mid-tier universities and high schools. Measure: 'Would you use this instead of Mynavi?' and observe first-session swipe depth.",
      color: NAVY,
    },
    {
      h: "H2. Companies will pay on success",
      test: "Contact 20 SMBs hiring this segment. Measure willingness to sign a ¥500K-per-hire agreement with no upfront cost.",
      color: NAVY_DARK,
    },
    {
      h: "H3. Match quality is better than resumes",
      test: "After 10 interviews resulting from swipes, ask recruiters: 'Was this a better-fit candidate than your last Mynavi applicant?' Target: ≥60% yes.",
      color: GOLD,
    },
  ];

  hyps.forEach((h, i) => {
    const y = 2.35 + i * 0.92;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.8,
      fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.1, h: 0.8, fill: { color: h.color }, line: { color: h.color },
    });
    s.addText(h.h, {
      x: 0.8, y: y + 0.1, w: 2.5, h: 0.6,
      fontSize: 14, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(h.test, {
      x: 3.4, y: y + 0.12, w: 6.0, h: 0.6,
      fontSize: 10, fontFace: FONT_BODY, color: MUTED, margin: 0,
    });
  });

  s.addText("Each test is cheap and bounded. If any hypothesis fails, the model changes — not the other way around.", {
    x: 0.5, y: 5.05, w: 9, h: 0.2,
    fontSize: 10, fontFace: FONT_BODY, italic: true, color: NAVY, margin: 0,
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 10: Risks ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: BG };
  addBrandChip(s);
  addFooterBar(s);

  addEyebrow(s, "Risks & Open Questions");
  addTitle(s, "What could kill this idea.", { fontSize: 30 });

  const risks = [
    {
      r: "Cold-start problem",
      m: "Students don't come without companies; companies don't come without students. Likely need to seed one side manually.",
    },
    {
      r: "Trust gap for SMBs",
      m: "Paying ¥500K on success still requires a signed agreement and invoicing. Less friction than subscriptions, but not zero.",
    },
    {
      r: "Substitute risk",
      m: "Mynavi or Rikunabi could add swipe UX. Defensibility comes from serving the underserved segment before they do.",
    },
    {
      r: "Legal & data",
      m: "Handling student resumes and company HR data in Japan has specific compliance requirements (個人情報保護法) that need proper design.",
    },
  ];

  risks.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 2.3 + row * 1.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 1.2,
      fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 0.08, fill: { color: NAVY_DARK }, line: { color: NAVY_DARK },
    });
    s.addText(r.r, {
      x: x + 0.25, y: y + 0.2, w: 4.0, h: 0.35,
      fontSize: 14, fontFace: FONT_HEADER, bold: true, color: INK, margin: 0,
    });
    s.addText(r.m, {
      x: x + 0.25, y: y + 0.55, w: 4.0, h: 0.6,
      fontSize: 10, fontFace: FONT_BODY, color: MUTED, margin: 0,
    });
  });

  addPageNumber(s, slideNum, TOTAL);
}

// ========== Slide 11: Close ==========
{
  slideNum++;
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.7, w: 10, h: 0.1, fill: { color: GOLD }, line: { color: GOLD },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 0.6, w: 0.35, h: 0.35, fill: { color: GOLD }, line: { color: GOLD },
  });
  s.addText("JobSwipe", {
    x: 1.05, y: 0.55, w: 3, h: 0.45,
    fontSize: 16, fontFace: FONT_HEADER, bold: true, color: WHITE, margin: 0,
  });

  s.addText("The thesis, in one sentence.", {
    x: 0.6, y: 1.3, w: 9, h: 0.5,
    fontSize: 14, fontFace: FONT_BODY, color: "CADCFC", italic: true, charSpacing: 2, margin: 0,
  });

  s.addText("Build for the students", {
    x: 0.6, y: 1.9, w: 9, h: 0.8,
    fontSize: 42, fontFace: FONT_HEADER, bold: true, color: WHITE, margin: 0,
  });
  s.addText("existing platforms ignore.", {
    x: 0.6, y: 2.65, w: 9, h: 0.8,
    fontSize: 42, fontFace: FONT_HEADER, bold: true, color: GOLD, margin: 0,
  });

  s.addText("Next step: run the three validation tests in slide 09 over the next 6–8 weeks, then decide whether to invest further effort based on the results.", {
    x: 0.6, y: 3.8, w: 8.8, h: 0.8,
    fontSize: 13, fontFace: FONT_BODY, color: "CADCFC", margin: 0,
  });

  s.addText("[Your Name]   ·   Solo builder   ·   JobSwipe", {
    x: 0.6, y: 4.95, w: 9, h: 0.3,
    fontSize: 12, fontFace: FONT_BODY, color: "CADCFC", charSpacing: 4, margin: 0,
  });
}

pres.writeFile({ fileName: "C:/Spring 2026/jobswipe-deck/JobSwipe_Pitch_Deck.pptx" })
  .then((f) => console.log(`Wrote: ${f}`));
