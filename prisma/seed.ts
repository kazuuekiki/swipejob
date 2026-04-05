import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
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
      culture: "成長志向,フラットな組織,技術重視",
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
      culture: "社会貢献,チームワーク,安定志向",
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
      culture: "スピード重視,裁量が大きい,挑戦的",
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
      culture: "クリエイティブ,体育会系,情熱的",
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
      culture: "社会貢献,成長志向,多様性",
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
      culture: "実力主義,チームワーク,安定志向",
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
      culture: "自由な働き方,社会貢献,フラットな組織",
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
      culture: "安定志向,体育会系,スケールが大きい",
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
      culture: "成長志向,実力主義,グローバル",
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
      culture: "グローバル,挑戦的,多様性",
      logoColor: "#dc2626",
    },
  },
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
      culture: "技術重視,実力主義,プロフェッショナル",
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
      culture: "社会貢献,自由な働き方,アットホーム",
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
      culture: "技術重視,スケールが大きい,安定志向",
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
      culture: "成長志向,研修充実,チームワーク",
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
      culture: "アットホーム,自由な働き方,挑戦的",
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
      culture: "プロフェッショナル,成長志向,実力主義",
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
      culture: "挑戦的,技術重視,フラットな組織",
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
      culture: "ワークライフバランス,社会貢献,アットホーム",
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
      culture: "技術重視,安定志向,チームワーク",
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
      culture: "グローバル,自由な働き方,クリエイティブ",
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
      culture: "技術重視,スケールが大きい,体育会系",
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
      culture: "裁量が大きい,挑戦的,フラットな組織",
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
      culture: "社会貢献,アットホーム,情熱的",
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
      culture: "クリエイティブ,情熱的,グローバル",
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
      culture: "技術重視,プロフェッショナル,成長志向",
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
      culture: "スピード重視,体育会系,実力主義",
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
      culture: "クリエイティブ,自由な働き方,フラットな組織",
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
      culture: "社会貢献,ワークライフバランス,チームワーク",
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
      culture: "挑戦的,クリエイティブ,自由な働き方",
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
      culture: "社会貢献,安定志向,チームワーク",
      logoColor: "#e85d04",
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
