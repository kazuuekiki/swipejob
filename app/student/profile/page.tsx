"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { ArrowLeft, Camera, FileText, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
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
  photoUrl: string | null;
  resumeUrl: string | null;
}

const EDUCATION_TYPES = ["高校", "専門学校", "短大", "大学", "大学院", "その他"];
const YEARS = Array.from({ length: 10 }, (_, i) => 2024 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((d) => { setProfile(d); setLoading(false); });
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
    setSaving(false);
    showToast("保存しました！");
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
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="pb-20 max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-gray-800">マイプロフィール</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 text-indigo-600 font-bold text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中..." : "保存"}
          </button>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* 証明写真 */}
          <div className="flex flex-col items-center">
            <label className="relative cursor-pointer group">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="証明写真" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <p className="text-[10px] text-gray-400 mt-1">証明写真をアップロード</p>
          </div>

          {/* 必須項目 */}
          <Section title="基本情報（必須）">
            <Field label="氏名" value={profile.name} onChange={(v) => handleChange("name", v)} required />
            <Field label="学校名" value={profile.school} onChange={(v) => handleChange("school", v)} required />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">卒業予定年</label>
                <select
                  value={profile.graduationYear}
                  onChange={(e) => handleChange("graduationYear", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-800"
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">卒業予定月</label>
                <select
                  value={profile.graduationMonth}
                  onChange={(e) => handleChange("graduationMonth", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-800"
                >
                  {MONTHS.map((m) => <option key={m} value={m}>{m}月</option>)}
                </select>
              </div>
            </div>
          </Section>

          {/* 学歴 */}
          <Section title="学歴">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">学歴区分</label>
              <select
                value={profile.educationType || ""}
                onChange={(e) => handleChange("educationType", e.target.value || null)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-800"
              >
                <option value="">選択してください</option>
                {EDUCATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Field label="学部・学科" value={profile.faculty || ""} onChange={(v) => handleChange("faculty", v || null)} />
          </Section>

          {/* 自己紹介 */}
          <Section title="自己紹介">
            <Field label="居住地" value={profile.location || ""} onChange={(v) => handleChange("location", v || null)} />
            <TextArea label="自己紹介" value={profile.bio || ""} onChange={(v) => handleChange("bio", v || null)} />
            <TextArea label="自己PR" value={profile.selfPr || ""} onChange={(v) => handleChange("selfPr", v || null)} />
            <TextArea label="ガクチカ" value={profile.gakuchika || ""} onChange={(v) => handleChange("gakuchika", v || null)} />
          </Section>

          {/* 希望 */}
          <Section title="希望条件">
            <Field label="志望業界" value={profile.desiredIndustry || ""} onChange={(v) => handleChange("desiredIndustry", v || null)} />
            <Field label="志望職種" value={profile.desiredJob || ""} onChange={(v) => handleChange("desiredJob", v || null)} />
            <Field label="希望勤務地" value={profile.desiredLocation || ""} onChange={(v) => handleChange("desiredLocation", v || null)} />
          </Section>

          {/* スキル・経験 */}
          <Section title="スキル・経験">
            <Field label="スキル" value={profile.skills || ""} onChange={(v) => handleChange("skills", v || null)} placeholder="例: React, Python, AWS" />
            <Field label="資格" value={profile.qualifications || ""} onChange={(v) => handleChange("qualifications", v || null)} placeholder="例: TOEIC 800, 基本情報技術者" />
            <TextArea label="インターン経験" value={profile.internship || ""} onChange={(v) => handleChange("internship", v || null)} />
          </Section>

          {/* レジュメ */}
          <Section title="レジュメ">
            <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
              <FileText className="w-8 h-8 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                {profile.resumeUrl ? (
                  <p className="text-sm text-green-600 font-medium">アップロード済み</p>
                ) : (
                  <p className="text-sm text-gray-500">PDF/画像をアップロード</p>
                )}
                <p className="text-[10px] text-gray-400">5MB以下</p>
              </div>
              <input type="file" accept=".pdf,image/*" onChange={handleResumeUpload} className="hidden" />
            </label>
          </Section>
        </div>
      </main>
      <NavBar />

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg z-50 bg-green-500">
          {toast}
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-700 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
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
      <label className="text-xs text-gray-500 mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 text-gray-800"
      />
    </div>
  );
}
