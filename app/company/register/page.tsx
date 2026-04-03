"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    companyName: "",
    description: "",
    industry: "",
    location: "",
    employeeCount: "",
    salary: "",
    catchphrase: "",
    foundedYear: "",
    workStyle: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/company/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/company/applications");
    router.refresh();
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-indigo-600">SwipeJob</h1>
          <p className="text-sm text-gray-500 mt-1">企業登録</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl">{error}</div>}
          {[
            { key: "companyName", label: "会社名 *", placeholder: "株式会社〇〇" },
            { key: "email", label: "担当者メールアドレス *", placeholder: "hr@company.com", type: "email" },
            { key: "password", label: "パスワード *", placeholder: "••••••••", type: "password" },
            { key: "catchphrase", label: "キャッチコピー", placeholder: "世界を変える技術を、一緒に。" },
            { key: "industry", label: "業界", placeholder: "IT・Web" },
            { key: "location", label: "勤務地", placeholder: "東京都渋谷区" },
            { key: "employeeCount", label: "社員数", placeholder: "100〜300名" },
            { key: "salary", label: "初任給", placeholder: "月給22万円〜" },
            { key: "foundedYear", label: "設立", placeholder: "2010年" },
            { key: "workStyle", label: "働き方", placeholder: "リモート可・フレックス制" },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
              <input
                type={type || "text"}
                value={form[key as keyof typeof form]}
                onChange={set(key)}
                required={label.includes("*")}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">会社説明</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="会社の特徴や事業内容を入力してください"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "登録中..." : "企業登録する"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/auth/login" className="text-indigo-600 font-medium">ログインはこちら</Link>
        </p>
      </div>
    </div>
  );
}
