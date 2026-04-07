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
    annualSalary: string;
    location: string;
    employeeCount: string;
    industry: string;
    culture: string;
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
        <div className="flex items-center justify-center pt-2 pb-0">
          <img src="/logo.svg" alt="JobSwipe" className="h-8" />
        </div>
        <div className="px-4 pt-0 pb-0 h-[calc(100vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="w-9 h-9 border-[3px] border-[#2774AE]/20 border-t-[#2774AE] rounded-full animate-spin" />
            </div>
          ) : (
            <SwipeCard companies={companies} onSwipe={handleSwipe} />
          )}
        </div>
      </main>
      <NavBar />

      {toast && (
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-medium z-50 animate-fade-in-up ${
            toast.type === "error"
              ? "bg-red-500/90 shadow-[0_4px_20px_rgba(239,68,68,0.25)]"
              : "bg-[#2774AE]/90 shadow-[0_4px_20px_rgba(39,116,174,0.25)]"
          } backdrop-blur-sm`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
