import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

const NEW_COMPANIES = [
  {
    companyName: "サイバーセキュリティ株式会社",
    email: "hr@cybersec.co.jp",
    profile: {
      catchphrase: "デジタル社会を守る盾になれ",
      description: "企業向けセキュリティソリューションを提供。ホワイトハッカー集団として国内トップクラスの実績を持ちます。",
      industry: "セキュリティ",
      location: "東京都千代田区",
      employeeCount: "90名",
      salary: "月給28万円〜",
      foundedYear: "2014年",
      workStyle: "リモート可・フレックス制",
      logoColor: "#1e3a5f",
    },
  },
  {
    companyName: "アグリテック・ファーム",
    email: "jobs@agritech-farm.jp",
    profile: {
      catchphrase: "農業をテクノロジーで再定義する",
      description: "IoTセンサーとAIを活用したスマート農業プラットフォームを開発。全国200以上の農家と提携しています。",
      industry: "アグリテック",
      location: "北海道札幌市",
      employeeCount: "55名",
      salary: "月給22万円〜",
      foundedYear: "2020年",
      workStyle: "リモート中心・月1出社",
      logoColor: "#2d6a4f",
    },
  },
  {
    companyName: "モビリティ・ネクスト",
    email: "recruit@mobility-next.jp",
    profile: {
      catchphrase: "移動の未来をデザインする",
      description: "自動運転技術とMaaS（Mobility as a Service）プラットフォームの開発。トヨタ・ホンダとの共同プロジェクトも。",
      industry: "モビリティ・自動車",
      location: "愛知県豊田市",
      employeeCount: "250名",
      salary: "月給26万円〜",
      foundedYear: "2016年",
      workStyle: "ハイブリッド・R&D拠点勤務",
      logoColor: "#0077b6",
    },
  },
  {
    companyName: "クラウドブリッジ",
    email: "career@cloudbridge.co.jp",
    profile: {
      catchphrase: "クラウドの力で企業を変える",
      description: "AWS・GCP・Azureのマルチクラウド導入支援を行うSIer。エンジニア教育にも力を入れており、資格取得支援制度あり。",
      industry: "クラウド・SIer",
      location: "東京都新宿区",
      employeeCount: "320名",
      salary: "月給25万円〜",
      foundedYear: "2011年",
      workStyle: "フルリモート可",
      logoColor: "#4361ee",
    },
  },
  {
    companyName: "ペットケアテクノロジー",
    email: "hr@petcare-tech.jp",
    profile: {
      catchphrase: "ペットと人の幸せをテクノロジーで",
      description: "ペット向けウェアラブルデバイスとオンライン獣医相談サービスを展開。ペット市場1.5兆円に挑むスタートアップ。",
      industry: "ペットテック",
      location: "東京都目黒区",
      employeeCount: "35名",
      salary: "月給23万円〜",
      foundedYear: "2021年",
      workStyle: "フルリモート・犬猫同伴OK",
      logoColor: "#e76f51",
    },
  },
  {
    companyName: "リーガルAIジャパン",
    email: "jobs@legal-ai.jp",
    profile: {
      catchphrase: "AIで法務をもっとスマートに",
      description: "契約書レビューAIと法務SaaSを開発。大手法律事務所50社以上が導入済み。リーガルテック市場のリーダーを目指す。",
      industry: "リーガルテック",
      location: "東京都港区",
      employeeCount: "70名",
      salary: "月給27万円〜",
      foundedYear: "2018年",
      workStyle: "フレックス・週2リモート",
      logoColor: "#5a189a",
    },
  },
  {
    companyName: "スペースデータ株式会社",
    email: "recruit@spacedata.jp",
    profile: {
      catchphrase: "宇宙データで地球の課題を解く",
      description: "衛星データ解析プラットフォームを提供。農業・防災・都市計画など幅広い分野でデータ活用を推進しています。",
      industry: "宇宙・衛星データ",
      location: "東京都文京区",
      employeeCount: "45名",
      salary: "月給26万円〜",
      foundedYear: "2019年",
      workStyle: "フルフレックス・リモート可",
      logoColor: "#023e8a",
    },
  },
  {
    companyName: "ウェルネスプラス",
    email: "hr@wellnessplus.jp",
    profile: {
      catchphrase: "心と体の健康をサポート",
      description: "法人向けメンタルヘルス・フィットネスSaaSを展開。従業員のウェルビーイング向上で企業の生産性をアップ。",
      industry: "ウェルネス・HR",
      location: "大阪府大阪市",
      employeeCount: "85名",
      salary: "月給23万円〜",
      foundedYear: "2017年",
      workStyle: "ハイブリッド・時短勤務可",
      logoColor: "#ff6b6b",
    },
  },
  {
    companyName: "デジタルツイン建築",
    email: "career@dt-arch.jp",
    profile: {
      catchphrase: "建築の未来をデジタルで創る",
      description: "BIMとデジタルツイン技術を活用した次世代建築設計ツールを開発。大手ゼネコンとの協業実績多数。",
      industry: "建築テック",
      location: "東京都中央区",
      employeeCount: "110名",
      salary: "月給25万円〜",
      foundedYear: "2015年",
      workStyle: "週3出社・2リモート",
      logoColor: "#495057",
    },
  },
  {
    companyName: "トラベルDXカンパニー",
    email: "jobs@traveldx.co.jp",
    profile: {
      catchphrase: "旅行体験を再発明する",
      description: "AI旅行プランナーと観光DXプラットフォームを運営。インバウンド観光市場の急成長を支えるサービスを提供。",
      industry: "トラベルテック",
      location: "京都府京都市",
      employeeCount: "65名",
      salary: "月給22万円〜",
      foundedYear: "2020年",
      workStyle: "リモート中心・出張あり",
      logoColor: "#f4a261",
    },
  },
  {
    companyName: "ロボティクスワン",
    email: "recruit@robotics-one.jp",
    profile: {
      catchphrase: "ロボットと人が協働する世界へ",
      description: "協働ロボットの開発・製造。工場の自動化から飲食店の配膳ロボットまで幅広いソリューションを展開中。",
      industry: "ロボティクス",
      location: "神奈川県川崎市",
      employeeCount: "180名",
      salary: "月給25万円〜",
      foundedYear: "2013年",
      workStyle: "R&D拠点勤務・フレックス",
      logoColor: "#343a40",
    },
  },
  {
    companyName: "ブロックチェーンラボ",
    email: "hr@blockchain-lab.jp",
    profile: {
      catchphrase: "Web3で社会インフラを変革",
      description: "ブロックチェーン技術を活用したデジタルID・サプライチェーン管理ソリューションを開発するWeb3スタートアップ。",
      industry: "Web3・ブロックチェーン",
      location: "東京都渋谷区",
      employeeCount: "40名",
      salary: "月給30万円〜",
      foundedYear: "2021年",
      workStyle: "フルリモート・DAO的組織",
      logoColor: "#7209b7",
    },
  },
  {
    companyName: "クリーンオーシャン",
    email: "jobs@clean-ocean.jp",
    profile: {
      catchphrase: "海洋環境を守るテクノロジー",
      description: "海洋プラスチック回収ドローンとマイクロプラスチック検出技術を開発。環境省との共同プロジェクトも進行中。",
      industry: "環境テック",
      location: "沖縄県那覇市",
      employeeCount: "30名",
      salary: "月給22万円〜",
      foundedYear: "2022年",
      workStyle: "現地＋リモートのハイブリッド",
      logoColor: "#0096c7",
    },
  },
  {
    companyName: "アニメーションスタジオZERO",
    email: "career@anime-zero.jp",
    profile: {
      catchphrase: "世界に届くアニメを作ろう",
      description: "AI活用のアニメーション制作スタジオ。Netflix・Crunchyrollとの取引実績あり。クリエイターファースト文化。",
      industry: "アニメ・エンタメ",
      location: "東京都杉並区",
      employeeCount: "95名",
      salary: "月給23万円〜",
      foundedYear: "2016年",
      workStyle: "スタジオ勤務・フレックス",
      logoColor: "#d00000",
    },
  },
  {
    companyName: "QuantumTech Japan",
    email: "recruit@quantumtech.jp",
    profile: {
      catchphrase: "量子コンピューティングの最前線",
      description: "量子アニーリングとゲート型量子コンピュータの産業応用研究。製薬・金融分野での実証実験を多数実施。",
      industry: "量子コンピューティング",
      location: "東京都文京区",
      employeeCount: "50名",
      salary: "月給32万円〜",
      foundedYear: "2019年",
      workStyle: "研究所勤務・フレックス",
      logoColor: "#3a0ca3",
    },
  },
  {
    companyName: "フードデリバリーNOW",
    email: "hr@fd-now.jp",
    profile: {
      catchphrase: "届ける、を最速に",
      description: "AIルート最適化による超高速フードデリバリーサービス。30分以内配達率98%を実現。全国15都市で展開中。",
      industry: "デリバリー・物流",
      location: "東京都品川区",
      employeeCount: "400名",
      salary: "月給24万円〜",
      foundedYear: "2018年",
      workStyle: "オフィス勤務・シフト制あり",
      logoColor: "#e63946",
    },
  },
  {
    companyName: "音楽テクノロジーズ",
    email: "jobs@music-tech.jp",
    profile: {
      catchphrase: "音楽×AIで新しい体験を",
      description: "AI作曲支援ツールと音楽ストリーミング解析プラットフォームを運営。アーティストの創作活動をテクノロジーで支援。",
      industry: "ミュージックテック",
      location: "東京都渋谷区",
      employeeCount: "45名",
      salary: "月給24万円〜",
      foundedYear: "2020年",
      workStyle: "フルリモート・音楽スタジオ完備",
      logoColor: "#9b5de5",
    },
  },
  {
    companyName: "介護イノベーション",
    email: "recruit@care-innovation.jp",
    profile: {
      catchphrase: "介護の現場を笑顔に変える",
      description: "介護施設向けのIoT見守りシステムとケアプランAIを開発。超高齢社会の課題をテクノロジーで解決します。",
      industry: "介護テック",
      location: "福岡県福岡市",
      employeeCount: "75名",
      salary: "月給22万円〜",
      foundedYear: "2017年",
      workStyle: "ハイブリッド・現場訪問あり",
      logoColor: "#2a9d8f",
    },
  },
  {
    companyName: "バーチャルリアリティJP",
    email: "hr@vr-jp.co.jp",
    profile: {
      catchphrase: "仮想空間で未来の働き方を",
      description: "企業向けVR研修・メタバースオフィスソリューションを展開。大手企業100社以上の導入実績。",
      industry: "VR・メタバース",
      location: "東京都港区",
      employeeCount: "130名",
      salary: "月給26万円〜",
      foundedYear: "2016年",
      workStyle: "メタバース出社可・フルリモート",
      logoColor: "#560bad",
    },
  },
  {
    companyName: "防災テックソリューションズ",
    email: "jobs@bosai-tech.jp",
    profile: {
      catchphrase: "テクノロジーで命を守る",
      description: "AIによる災害予測システムと自治体向け防災DXプラットフォームを開発。全国80以上の自治体に導入済み。",
      industry: "防災テック",
      location: "兵庫県神戸市",
      employeeCount: "60名",
      salary: "月給24万円〜",
      foundedYear: "2015年",
      workStyle: "ハイブリッド・出張あり",
      logoColor: "#e85d04",
    },
  },
];

async function main() {
  console.log("🏢 Adding 20 new companies...");

  const password = await bcrypt.hash("password123", 10);

  for (const c of NEW_COMPANIES) {
    const exists = await prisma.user.findUnique({ where: { email: c.email } });
    if (exists) {
      console.log(`  ⏭ ${c.companyName} already exists, skipping`);
      continue;
    }
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
    console.log(`  ✅ ${c.companyName}`);
  }

  const total = await prisma.company.count();
  console.log(`\n🎉 Done! Total companies: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
