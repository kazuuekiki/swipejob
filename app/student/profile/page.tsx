"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { ArrowLeft, Camera, FileText, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  birthDate: string | null;
  school: string;
  graduationYear: number;
  graduationMonth: number;
  educationType: string | null;
  faculty: string | null;
  location: string | null;
  bio: string | null;
  selfPr: string | null;
  gakuchika: string | null;
  desiredIndustry: string | null;
  desiredJob: string | null;
  desiredLocation: string | null;
  skills: string | null;
  qualifications: string | null;
  internship: string | null;
  mbti: string | null;
  photoUrl: string | null;
  resumeUrl: string | null;
}

const EDUCATION_TYPES = ["高校", "大学"];
const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];
const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedProfile, setSavedProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const hasChanges = profile && savedProfile && JSON.stringify(profile) !== JSON.stringify(savedProfile);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((d) => {
        const p: Profile = d ?? {
          name: "", birthDate: null, school: "", graduationYear: 2026, graduationMonth: 3,
          educationType: null, faculty: null, location: null, bio: null, selfPr: null,
          gakuchika: null, desiredIndustry: null, desiredJob: null, desiredLocation: null,
          skills: null, qualifications: null, internship: null, mbti: null,
          photoUrl: null, resumeUrl: null,
        };
        setProfile(p); setSavedProfile(p); setLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (key: keyof Profile, value: string | number | null) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSavedProfile({ ...profile });
    setSaving(false);
    showToast("保存しました！");
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowLeaveDialog(true);
    } else {
      router.back();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("画像は2MB以下にしてください");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => handleChange("photoUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("ファイルは5MB以下にしてください");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => handleChange("resumeUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-9 h-9 border-[3px] border-[#2774AE]/20 border-t-[#2774AE] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="pb-20 max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/40 px-4 py-3.5 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <button onClick={handleBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h1 className="font-bold text-gray-800 tracking-tight">マイプロフィール</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 text-[#2774AE] font-bold text-sm hover:text-[#1e5f94] transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : "保存"}
          </button>
        </div>

        <div className="px-4 py-6 space-y-7">
          {/* 証明写真 */}
          <div className="flex flex-col items-center animate-fade-in">
            <label className="relative cursor-pointer group">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="証明写真" className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                  <Camera className="w-7 h-7 text-gray-300" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#2774AE] rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                <Camera className="w-3 h-3 text-white" />
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {profile.photoUrl ? (
              <button
                onClick={() => handleChange("photoUrl", null)}
                className="flex items-center gap-1 text-[11px] text-red-400 mt-2 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> 写真を削除
              </button>
            ) : (
              <p className="text-[10px] text-gray-400 mt-2">証明写真をアップロード</p>
            )}
          </div>

          {/* 基本情報 */}
          <Section title="基本情報" required>
            <Field label="氏名" value={profile.name} onChange={(v) => handleChange("name", v)} required />
            <div>
              <label className="text-[11px] text-gray-400 font-medium mb-1.5 block tracking-wide">
                生年月日 <span className="text-[#2774AE]">*</span>
              </label>
              <input
                type="date"
                value={profile.birthDate || ""}
                onChange={(e) => handleChange("birthDate", e.target.value || null)}
                className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 transition-all"
              />
            </div>
          </Section>

          {/* 学歴 */}
          <Section title="最終学歴（高校または大学）">
            <Field label="学校名（最終卒業または在学中）" value={profile.school} onChange={(v) => handleChange("school", v)} required />
            <div>
              <label className="text-[11px] text-gray-400 font-medium mb-1.5 block tracking-wide">学歴区分</label>
              <select
                value={profile.educationType || ""}
                onChange={(e) => handleChange("educationType", e.target.value || null)}
                className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 transition-all"
              >
                <option value="">選択してください</option>
                {EDUCATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Field label="学部・学科" value={profile.faculty || ""} onChange={(v) => handleChange("faculty", v || null)} />
            <div>
              <label className="text-[11px] text-gray-400 font-medium mb-1.5 block tracking-wide">
                卒業年月（在学中の方は予定年月） <span className="text-[#2774AE]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={profile.graduationYear}
                  onChange={(e) => handleChange("graduationYear", Number(e.target.value))}
                  className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 transition-all"
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}年</option>)}
                </select>
                <select
                  value={profile.graduationMonth}
                  onChange={(e) => handleChange("graduationMonth", Number(e.target.value))}
                  className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 transition-all"
                >
                  {MONTHS.map((m) => <option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* 自己紹介 */}
          <Section title="自己紹介">
            <Field label="住所" value={profile.location || ""} onChange={(v) => handleChange("location", v || null)} placeholder="例）東京都千代田区丸の内" />
            <div>
              <label className="text-[11px] text-gray-400 font-medium mb-1.5 block tracking-wide">MBTI</label>
              <select
                value={profile.mbti || ""}
                onChange={(e) => handleChange("mbti", e.target.value || null)}
                className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 transition-all"
              >
                <option value="">選択してください</option>
                {MBTI_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <TextArea label="自己紹介" value={profile.bio || ""} onChange={(v) => handleChange("bio", v || null)} required placeholder="例）○○大学○○学部に在籍中の○○と申します。大学ではマーケティングを専攻し、ゼミではデータ分析を用いた消費者行動の研究に取り組んでいます。課外活動ではイベント企画サークルの代表を務め、年間3回の大型イベントを運営しました。" />
            <TextArea label="自己PR" value={profile.selfPr || ""} onChange={(v) => handleChange("selfPr", v || null)} required placeholder="例）私の強みは「課題発見力と実行力」です。アルバイト先の飲食店では、お客様アンケートを自主的に実施し、待ち時間への不満が多いことを発見。オペレーション改善を提案・実行した結果、回転率が15%向上し、売上増加に貢献しました。この経験から、現状に疑問を持ち改善策を実行する力を身につけました。" />
          </Section>

          {/* 希望 */}
          <Section title="希望条件">
            <Field label="志望業界" value={profile.desiredIndustry || ""} onChange={(v) => handleChange("desiredIndustry", v || null)} />
            <Field label="志望職種" value={profile.desiredJob || ""} onChange={(v) => handleChange("desiredJob", v || null)} />
            <Field label="希望勤務地" value={profile.desiredLocation || ""} onChange={(v) => handleChange("desiredLocation", v || null)} />
          </Section>

          {/* スキル・経験 */}
          <Section title="スキル・経験">
            <Field label="スキル" value={profile.skills || ""} onChange={(v) => handleChange("skills", v || null)} placeholder="例: リーダーシップ, Python, Excel" />
            <Field label="資格" value={profile.qualifications || ""} onChange={(v) => handleChange("qualifications", v || null)} placeholder="例: TOEIC 800, 基本情報技術者" />
            <TextArea label="アルバイト等経験" value={profile.internship || ""} onChange={(v) => handleChange("internship", v || null)} placeholder="例）カフェのバリスタとして2年間勤務。新人教育を担当し、マニュアルの整備とOJT制度を導入。チーム全体の接客品質向上に貢献しました。" />
          </Section>

          {/* レジュメ */}
          <Section title="レジュメ">
            <label className="flex items-center gap-3 bg-white border border-gray-150 border-dashed rounded-xl p-4 cursor-pointer hover:bg-gray-50/50 hover:border-[#2774AE]/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#2774AE]/5 transition-colors">
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#2774AE] transition-colors" />
              </div>
              <div className="flex-1">
                {profile.resumeUrl ? (
                  <p className="text-sm text-emerald-600 font-medium">アップロード済み</p>
                ) : (
                  <p className="text-sm text-gray-500">PDF/画像をアップロード</p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">5MB以下</p>
              </div>
              <input type="file" accept=".pdf,image/*" onChange={handleResumeUpload} className="hidden" />
            </label>
            {profile.resumeUrl && (
              <button
                onClick={() => handleChange("resumeUrl", null)}
                className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-500 transition-colors mt-1"
              >
                <Trash2 className="w-3 h-3" /> レジュメを削除
              </button>
            )}
          </Section>
        </div>
      </main>
      <NavBar />

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-medium shadow-[0_4px_20px_rgba(39,116,174,0.25)] z-50 bg-[#2774AE]/90 backdrop-blur-sm animate-fade-in-up">
          {toast}
        </div>
      )}

      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full shadow-[0_8px_40px_rgba(0,0,0,0.12)] animate-fade-in-up">
            <h3 className="font-bold text-gray-800 text-base mb-2">変更が保存されていません</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">保存せずにこのページを離れますか？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveDialog(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                編集に戻る
              </button>
              <button
                onClick={() => { setShowLeaveDialog(false); router.back(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                保存しない
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children, required }: { title: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-[13px] font-bold text-gray-800 mb-3.5 tracking-tight">
        {title}
        {required && <span className="text-[11px] text-gray-400 font-normal ml-1.5">（必須）</span>}
      </h2>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function Field({
  label, value, onChange, required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] text-gray-400 font-medium mb-1.5 block tracking-wide">
        {label} {required && <span className="text-[#2774AE]">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 text-gray-800 placeholder:text-gray-300 transition-all"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] text-gray-400 font-medium mb-1.5 block tracking-wide">
        {label} {required && <span className="text-[#2774AE]">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-150 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2774AE]/20 focus:border-[#2774AE]/30 resize-none h-28 text-gray-800 placeholder:text-gray-300 transition-all leading-relaxed"
      />
    </div>
  );
}
