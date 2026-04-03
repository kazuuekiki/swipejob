"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function CompanyProfilePage() {
  const [form, setForm] = useState({
    description: "",
    industry: "",
    location: "",
    employeeCount: "",
    salary: "",
    catchphrase: "",
    foundedYear: "",
    workStyle: "",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile) setForm(d.profile);
        setLoading(false);
      });
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/company/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (loading) return (
    <>
      <NavBar />
      <div className="pt-14 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  return (
    <>
      <NavBar />
      <main className="pt-14 max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-black text-gray-800 mb-4">プロフィール編集</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "catchphrase", label: "キャッチコピー", placeholder: "世界を変える技術を、一緒に。" },
            { key: "industry", label: "業界", placeholder: "IT・Web" },
            { key: "location", label: "勤務地", placeholder: "東京都渋谷区" },
            { key: "employeeCount", label: "社員数", placeholder: "100〜300名" },
            { key: "salary", label: "初任給", placeholder: "月給22万円〜" },
            { key: "foundedYear", label: "設立", placeholder: "2010年" },
            { key: "workStyle", label: "働き方", placeholder: "リモート可・フレックス制" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <label className="text-xs font-medium text-gray-400 mb-1 block">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full text-sm text-gray-800 focus:outline-none"
              />
            </div>
          ))}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <label className="text-xs font-medium text-gray-400 mb-1 block">会社説明</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="会社の特徴や事業内容"
              className="w-full text-sm text-gray-800 focus:outline-none h-24 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700"
          >
            {saved ? "保存しました ✓" : "保存する"}
          </button>
        </form>
      </main>
    </>
  );
}
