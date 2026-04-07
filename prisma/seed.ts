import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { parse } from "csv-parse/sync";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

// ---------- CSV -> Company transform ----------
const COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4",
  "#8b5cf6", "#f97316", "#64748b", "#059669", "#dc2626",
  "#1e3a5f", "#2d6a4f", "#0077b6", "#4361ee", "#e76f51",
  "#5a189a", "#023e8a", "#ff6b6b", "#495057", "#f4a261",
  "#343a40", "#7209b7", "#0096c7", "#d00000", "#3a0ca3",
  "#e63946", "#9b5de5", "#2a9d8f", "#560bad", "#e85d04",
];

function guessCulture(r: any): string {
  const tags: string[] = [];
  const desc = (r.business_description || "") + (r.remarks || "") + (r.job_description || "");
  const holidays = parseInt(r.annual_holidays) || parseInt(r.holidays) || 0;
  if (holidays >= 120) tags.push("ワークライフバランス");
  if (/安定|創業|歴史/.test(desc)) tags.push("安定志向");
  if (/成長|スキルアップ|研修|教育/.test(desc)) tags.push("成長志向");
  if (/チーム|仲間|協力/.test(desc)) tags.push("チームワーク");
  if (/技術|エンジニア|開発/.test(desc)) tags.push("技術重視");
  if (/未経験|経験不問/.test(desc)) tags.push("未経験歓迎");
  if (/リモート|在宅/.test(desc)) tags.push("自由な働き方");
  if (/社会|地域|貢献/.test(desc)) tags.push("社会貢献");
  if (/アットホーム|家族|温かい/.test(desc)) tags.push("アットホーム");
  if (tags.length === 0) tags.push("安定志向");
  return tags.slice(0, 3).join(",");
}

function extractCity(loc: string): string {
  if (!loc) return "";
  const m = loc.match(/(東京都|北海道|(?:京都|大阪)府|.+?県)(.+?[市区町村郡])/);
  if (m) return m[1] + m[2];
  const m2 = loc.match(/(東京都|北海道|(?:京都|大阪)府|.+?県)/);
  if (m2) return m2[1];
  return "";
}

function formatSalary(min: string, max: string): string {
  const smin = parseInt(min);
  const smax = parseInt(max);
  if (!smin && !smax) return "";
  if (smin && smax) return `月給${(smin / 10000).toFixed(1)}万円〜${(smax / 10000).toFixed(1)}万円`;
  if (smin) return `月給${(smin / 10000).toFixed(1)}万円〜`;
  return `月給〜${(smax / 10000).toFixed(1)}万円`;
}

function extractEmployees(emp: string): string {
  if (!emp) return "";
  const m = emp.match(/(\d[\d,]*)\s*人/);
  if (m) return m[1].replace(/,/g, "") + "名";
  return "";
}

function extractCatchphrase(r: any): string {
  let title = (r.job_title || "").replace(/職種解説\s*\n?/, "").trim();
  title = title.replace(/[「」]/g, "");
  if (title.length > 40) title = title.substring(0, 40) + "...";
  return title || r.company_name;
}

interface CompanyData {
  companyName: string;
  email: string;
  profile: {
    catchphrase: string;
    description: string;
    industry: string;
    location: string;
    employeeCount: string;
    salary: string;
    foundedYear: string;
    workStyle: string;
    culture: string;
    logoColor: string;
  };
}

function loadCompaniesFromCsv(): CompanyData[] {
  const csvPath = resolve(__dirname, "collected.csv");
  if (!existsSync(csvPath)) {
    console.warn("collected.csv not found, falling back to companies-data.json");
    return JSON.parse(readFileSync(resolve(__dirname, "companies-data.json"), "utf-8"));
  }
  const text = readFileSync(csvPath, "utf-8");
  const records: any[] = parse(text, { columns: true, bom: true, relax_column_count: true });

  const seen = new Set<string>();
  const unique: any[] = [];
  for (const r of records) {
    const name = (r.company_name || "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    unique.push(r);
  }

  return unique.map((r, i) => {
    const name = (r.company_name || "").trim().replace(/\s+/g, " ");
    return {
      companyName: name,
      email: `hr${i + 1}@company.example.jp`,
      profile: {
        catchphrase: extractCatchphrase(r),
        description: (r.business_description || "").replace(/\n/g, "").trim().substring(0, 200),
        industry: (r.industry || "").trim(),
        location: extractCity(r.location),
        employeeCount: extractEmployees(r.employees),
        salary: formatSalary(r.salary_min, r.salary_max),
        foundedYear: "",
        workStyle: (r.employment_type || "").trim(),
        culture: guessCulture(r),
        logoColor: COLORS[i % COLORS.length],
      },
    };
  });
}

const COMPANIES: CompanyData[] = loadCompaniesFromCsv();

const STUDENTS = [
  {
    email: "taro@student.example.jp",
    name: "山田 太郎",
    school: "東京大学",
    graduationYear: 2026,
    bio: "情報工学専攻。機械学習・Webアプリ開発が得意。インターンでReactとPythonの経験あり。",
  },
  {
    email: "hanako@student.example.jp",
    name: "佐藤 花子",
    school: "早稲田大学",
    graduationYear: 2026,
    bio: "経営学部。マーケティングとデータ分析に興味があり、スタートアップでのインターン経験あり。",
  },
  {
    email: "kenji@student.example.jp",
    name: "鈴木 健二",
    school: "慶應義塾大学",
    graduationYear: 2027,
    bio: "環境工学専攻。サステナビリティに強い関心を持ち、ESG投資やグリーンビジネスを志向。",
  },
];

async function main() {
  console.log(`Seeding ${COMPANIES.length} companies (upsert)...`);
  const password = await bcrypt.hash("password123", 10);

  // Upsert companies by email. User data (favorites/applications) is preserved.
  for (const c of COMPANIES) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {
        company: {
          update: {
            companyName: c.companyName,
            profile: {
              upsert: { create: c.profile, update: c.profile },
            },
          },
        },
      },
      create: {
        email: c.email,
        password,
        role: "company",
        company: {
          create: {
            companyName: c.companyName,
            email: c.email,
            profile: { create: c.profile },
          },
        },
      },
    });
  }
  console.log(`Upserted ${COMPANIES.length} companies`);

  for (const s of STUDENTS) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        password,
        role: "student",
        studentProfile: {
          create: {
            name: s.name,
            school: s.school,
            graduationYear: s.graduationYear,
            bio: s.bio,
          },
        },
      },
    });
  }
  console.log(`Upserted ${STUDENTS.length} students`);
  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
