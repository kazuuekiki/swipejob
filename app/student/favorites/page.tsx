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
    // Remove from favorites after applying
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
      <main className="pb-16 max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-gray-800">気になるリスト</h1>
          {remaining !== null && (
            <span className="text-xs text-gray-400">
              残り <span className="font-bold text-[#2774AE]">{remaining}</span> 件応募可
            </span>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💝</p>
            <p>気になる企業はまだありません</p>
            <p className="text-xs mt-1">スワイプでハートを押すと追加されます</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-[#2774AE] text-white px-6 py-2 rounded-full text-sm font-semibold"
            >
              企業を探す
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => {
              const c = fav.company;
              const logoColor = c.profile?.logoColor || "#6366f1";

              return (
                <div key={fav.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: logoColor }}
                      onClick={() => router.push(`/companies/${c.id}`)}
                    >
                      {c.companyName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{c.companyName}</h3>
                      <p className="text-xs text-gray-400">{c.profile?.industry} · {c.profile?.location}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleRemove(c.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApply(c.id)}
                        className="bg-[#2774AE] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#1a5276] transition"
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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg z-50 bg-[#2774AE]">
          {toast}
        </div>
      )}
    </>
  );
}
