"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import SwipeCard from "@/components/SwipeCard";
import Link from "next/link";

interface Company {
  id: number;
  companyName: string;
  profile: {
    catchphrase: string;
    salary: string;
    location: string;
    employeeCount: string;
    industry: string;
    logoColor: string;
  } | null;
}

export default function HomePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then((all: Company[]) => {
        const swiped = getSwiped();
        // If all companies have been swiped, reset
        if (swiped.length >= all.length) {
          clearSwiped();
          setCompanies(all);
        } else {
          setCompanies(all.filter((c) => !swiped.includes(c.id)));
        }
        setLoading(false);
      });
    fetch("/api/apply/remaining")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining));
  }, []);

  const getSwiped = (): number[] => {
    try {
      return JSON.parse(localStorage.getItem("swiped") || "[]");
    } catch { return []; }
  };
  const addSwiped = (id: number) => {
    const swiped = getSwiped();
    if (!swiped.includes(id)) {
      swiped.push(id);
      localStorage.setItem("swiped", JSON.stringify(swiped));
    }
  };
  const clearSwiped = () => localStorage.removeItem("swiped");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSwipe = async (companyId: number, action: "like" | "skip") => {
    addSwiped(companyId);
    if (action === "skip") return;
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
    });
    showToast("気になるリストに追加しました！");
  };

  return (
    <>
      <NavBar />
      <main className="pt-14 min-h-screen">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 py-2 flex items-center justify-between">
          <h1 className="text-base font-black tracking-tight">SwipeJob</h1>
          {remaining !== null && (
            <span className="bg-white/20 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-full">
              残り <span className="font-bold">{remaining}</span> 件
            </span>
          )}
        </div>

        <div className="px-4 py-3">
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <SwipeCard companies={companies} onSwipe={handleSwipe} />
          )}
        </div>

        {/* Quick nav */}
        <div className="px-4 pb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-3">各ページへ移動</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/student/applications" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">応募履歴</Link>
              <Link href="/student/matches" className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">マッチ</Link>
              <Link href="/company/applications" className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">企業：応募一覧</Link>
              <Link href="/company/profile" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">企業：プロフィール</Link>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg z-50 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
