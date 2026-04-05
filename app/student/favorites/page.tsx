"use client";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Favorite {
  id: number;
  companyId: number;
  company: {
    id: number;
    companyName: string;
    profile: {
      catchphrase: string;
      industry: string;
      location: string;
      salary: string;
      logoColor: string;
    } | null;
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/favorites").then((r) => r.json()).then(setFavorites);
    fetch("/api/apply/remaining").then((r) => r.json()).then((d) => setRemaining(d.remaining));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApply = async (companyId: number) => {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "エラーが発生しました");
      return;
    }
    setRemaining(data.remaining);
    showToast("応募しました！");
    setFavorites((prev) => prev.filter((f) => f.companyId !== companyId));
  };

  const handleRemove = async (companyId: number) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId }),
    });
    setFavorites((prev) => prev.filter((f) => f.companyId !== companyId));
  };

  return (
    <>
      <main className="pb-20 max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">気になるリスト</h1>
          {remaining !== null && (
            <span className="text-[11px] text-gray-400 font-medium">
              残り <span className="font-bold text-[#2774AE]">{remaining}</span> 件応募可
            </span>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-50 to-pink-100/50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💝</span>
            </div>
            <p className="text-[15px] font-semibold text-gray-700 mb-1">気になる企業はまだありません</p>
            <p className="text-xs text-gray-400 mb-5">スワイプでハートを押すと追加されます</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#2774AE] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-[0_2px_12px_rgba(39,116,174,0.25)] hover:shadow-[0_4px_20px_rgba(39,116,174,0.3)] transition-shadow"
            >
              企業を探す
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav, i) => {
              const c = fav.company;
              const logoColor = c.profile?.logoColor || "#6366f1";

              return (
                <div
                  key={fav.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden animate-fade-in-up shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="p-4 flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 cursor-pointer shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${logoColor}, ${logoColor}cc)` }}
                      onClick={() => router.push(`/companies/${c.id}`)}
                    >
                      {c.companyName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-[15px] tracking-tight truncate">{c.companyName}</h3>
                      <p className="text-[11px] text-gray-400">{c.profile?.industry} · {c.profile?.location}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRemove(c.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApply(c.id)}
                        className="bg-[#2774AE] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#1e5f94] active:scale-95 transition-all shadow-[0_2px_8px_rgba(39,116,174,0.2)]"
                      >
                        応募
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <NavBar />

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-medium shadow-[0_4px_20px_rgba(39,116,174,0.25)] z-50 bg-[#2774AE]/90 backdrop-blur-sm animate-fade-in-up">
          {toast}
        </div>
      )}
    </>
  );
}
