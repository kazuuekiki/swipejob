"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import SwipeCard from "@/components/SwipeCard";

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
      <main className="pb-16 min-h-screen">
        <div className="px-4 pt-2 pb-2">
          {remaining !== null && (
            <div className="text-center mb-1">
              <span className="text-[11px] text-gray-400">
                残り <span className="font-bold text-indigo-600">{remaining}</span> 件応募可
              </span>
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <SwipeCard companies={companies} onSwipe={handleSwipe} />
          )}
        </div>
      </main>
      <NavBar />

      {toast && (
        <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg z-50 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
