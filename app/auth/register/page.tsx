"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    school: "",
    graduationYear: String(new Date().getFullYear() + 1),
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push(redirect);
    router.refresh();
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-indigo-600">SwipeJob</h1>
          <p className="text-sm text-gray-500 mt-1">学生登録</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl">{error}</div>
          )}
          {[
            { key: "name", label: "お名前", type: "text", placeholder: "山田 太郎" },
            { key: "school", label: "大学名", type: "text", placeholder: "○○大学" },
            { key: "email", label: "メールアドレス", type: "email", placeholder: "you@example.com" },
            { key: "password", label: "パスワード", type: "password", placeholder: "••••••••" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={set(key)}
                required
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">卒業予定年</label>
            <select
              value={form.graduationYear}
              onChange={set("graduationYear")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[0, 1, 2, 3].map((offset) => {
                const y = new Date().getFullYear() + offset;
                return <option key={y} value={y}>{y}年卒</option>;
              })}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">自己紹介（任意）</label>
            <textarea
              value={form.bio}
              onChange={set("bio")}
              placeholder="簡単な自己紹介をどうぞ"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "登録中..." : "無料で登録する"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          既にアカウントをお持ちの方は{" "}
          <Link href="/auth/login" className="text-indigo-600 font-medium">ログイン</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
