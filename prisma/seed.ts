import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as any);

// Load companies from generated JSON (from HelloWork CSV data)
const companiesData = JSON.parse(
  readFileSync(resolve(__dirname, "companies-data.json"), "utf-8")
);

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

const COMPANIES: CompanyData[] = companiesData;

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
  console.log("Seeding database...");

  await prisma.message.deleteMany();
  await prisma.match.deleteMany();
  await prisma.application.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  for (const c of COMPANIES) {
    await prisma.user.create({
      data: {
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
  console.log(`Created ${COMPANIES.length} companies`);

  for (const s of STUDENTS) {
    await prisma.user.create({
      data: {
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
  console.log(`Created ${STUDENTS.length} students`);
  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
