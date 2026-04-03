import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

const COMPANIES = [
  {
    companyName: "テックビジョン株式会社",
    email: "hr@techvision.co.jp",
    profile: {
      catchphrase: "AIで未来を切り拓く",
      description: "最先端のAI技術を活用したプロダクトを開発しています。社員の成長を第一に考え、スキルアップのための研修制度が充実しています。",
      industry: "IT・AI",
      location: "東京都渋谷区",
      employeeCount: "150名",
      salary: "月給25万円〜",
      foundedYear: "2015年",
      workStyle: "フルリモート可・フレックス制",
      logoColor: "#6366f1",
    },
  },
  {
    companyName: "グリーンエナジー株式会社",
    email: "recruit@greenenergy.jp",
    profile: {
      catchphrase: "地球の未来を守る仕事",
      description: "再生可能エネルギーの普及を通じて、持続可能な社会の実現を目指しています。若手でも大きなプロジェクトに挑戦できる環境です。",
      industry: "エネルギー",
      location: "大阪府大阪市",
      employeeCount: "300名",
      salary: "月給23万円〜",
      foundedYear: "2008年",
      workStyle: "週2リモート・時短勤務可",
      logoColor: "#10b981",
    },
  },
  {
    companyName: "フードテックジャパン",
    email: "jobs@foodtech.jp",
    profile: {
      catchphrase: "食の革命を起こそう",
      description: "食品×テクノロジーで農業から食卓まで変革するスタートアップ。少数精鋭でスピード感を持って事業を展開中。",
      industry: "フードテック",
      location: "福岡県福岡市",
      employeeCount: "40名",
      salary: "月給22万円〜",
      foundedYear: "2019年",
      workStyle: "リモート中心・自由な働き方",
      logoColor: "#f59e0b",
    },
  },
  {
    companyName: "メディアクリエイト",
    email: "career@mediacreate.co.jp",
    profile: {
      catchphrase: "コンテンツで世界を熱くする",
      description: "動画・ゲーム・SNSを中心としたデジタルエンタメ企業。クリエイターが輝ける環境を用意しています。",
      industry: "エンタテインメント",
      location: "東京都港区",
      employeeCount: "500名",
      salary: "月給24万円〜",
      foundedYear: "2005年",
      workStyle: "ハイブリッド勤務",
      logoColor: "#ec4899",
    },
  },
  {
    companyName: "ヘルスケアイノベーション",
    email: "recruit@healthcare-i.jp",
    profile: {
      catchphrase: "テクノロジーで医療を変える",
      description: "医療DXを推進するヘルステックスタートアップ。医師・エンジニア・デザイナーが一体となってプロダクトを作っています。",
      industry: "ヘルスケア・医療",
      location: "東京都新宿区",
      employeeCount: "80名",
      salary: "月給26万円〜",
      foundedYear: "2017年",
      workStyle: "フレックスタイム・リモート可",
      logoColor: "#06b6d4",
    },
  },
  {
    companyName: "ロジスティクスDX",
    email: "hr@logistics-dx.co.jp",
    profile: {
      catchphrase: "物流の未来を設計する",
      description: "AIと自動化技術で物流業界の課題を解決。全国の主要都市に拠点を持ち、スケールアップ中の急成長企業です。",
      industry: "物流・SCM",
      location: "愛知県名古屋市",
      employeeCount: "200名",
      salary: "月給22万円〜",
      foundedYear: "2012年",
      workStyle: "週3出社・2リモート",
      logoColor: "#8b5cf6",
    },
  },
  {
    companyName: "エデュテックコーポレーション",
    email: "jobs@edutech-corp.jp",
    profile: {
      catchphrase: "学びをデザインする",
      description: "EdTechスタートアップとして、オンライン学習プラットフォームを運営。教育×テクノロジーで日本の学習体験を変えます。",
      industry: "EdTech・教育",
      location: "東京都千代田区",
      employeeCount: "60名",
      salary: "月給23万円〜",
      foundedYear: "2018年",
      workStyle: "完全リモート・フルフレックス",
      logoColor: "#f97316",
    },
  },
  {
    companyName: "スマートシティ建設",
    email: "recruit@smartcity-k.jp",
    profile: {
      catchphrase: "都市を、もっとスマートに",
      description: "IoTとビッグデータを活用したスマートシティの設計・施工・運営を行う総合建設企業。大規模プロジェクトに携われます。",
      industry: "建設・インフラ",
      location: "神奈川県横浜市",
      employeeCount: "800名",
      salary: "月給24万円〜",
      foundedYear: "1998年",
      workStyle: "現場勤務・週1リモート可",
      logoColor: "#64748b",
    },
  },
  {
    companyName: "ファイナンスラボ",
    email: "career@financelab.co.jp",
    profile: {
      catchphrase: "フィンテックで金融を民主化",
      description: "個人向け資産運用サービスを展開するフィンテック企業。金融とテクノロジーの融合で新しい価値を創造しています。",
      industry: "フィンテック・金融",
      location: "東京都中央区",
      employeeCount: "120名",
      salary: "月給27万円〜",
      foundedYear: "2016年",
      workStyle: "フレックス・リモート中心",
      logoColor: "#059669",
    },
  },
  {
    companyName: "グローバルコマース",
    email: "jobs@global-commerce.jp",
    profile: {
      catchphrase: "越境ECで世界に挑む",
      description: "日本の中小企業の商品を世界に届ける越境EC支援プラットフォーム。30か国以上への展開実績があります。",
      industry: "EC・小売",
      location: "東京都品川区",
      employeeCount: "180名",
      salary: "月給23万円〜",
      foundedYear: "2013年",
      workStyle: "ハイブリッド・英語使用機会あり",
      logoColor: "#dc2626",
    },
  },
];

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
  console.log("🌱 Seeding database...");

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
  console.log(`✅ Created ${COMPANIES.length} companies`);

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
  console.log(`✅ Created ${STUDENTS.length} students`);

  console.log("\n📋 Login credentials (all use password: password123)");
  console.log("Students:");
  STUDENTS.forEach((s) => console.log(`  ${s.email}`));
  console.log("Companies:");
  COMPANIES.slice(0, 3).forEach((c) => console.log(`  ${c.email}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
