"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { MessageCircle } from "lucide-react";

interface Match {
  id: number;
  createdAt: string;
  application: {
    company: {
      companyName: string;
      profile: { catchphrase: string; industry: string; logoColor: string } | null;
    };
  };
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("/api/matches").then((r) => r.json()).then(setMatches);
  }, []);

  return (
    <>
      <main className="pb-20 max-w-md mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-5">マッチした企業</h1>
        {matches.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💌</span>
            </div>
            <p className="text-[15px] font-semibold text-gray-700 mb-1">まだマッチしていません</p>
            <p className="text-xs text-gray-400">企業が応募を承認するとマッチします</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match, i) => {
              const company = match.application.company;
              const logoColor = company.profile?.logoColor || "#6366f1";
              return (
                <div
                  key={match.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex items-center gap-4 animate-fade-in-up shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${logoColor}, ${logoColor}cc)` }}
                  >
                    {company.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-[15px] tracking-tight truncate">{company.companyName}</h3>
                    <p className="text-[11px] text-gray-400">{company.profile?.industry}</p>
                    <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">マッチしました</p>
                  </div>
                  <button
                    onClick={() => router.push(`/student/chat/${match.id}`)}
                    className="w-10 h-10 bg-[#2774AE]/8 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-[#2774AE]/15 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-5 h-5 text-[#2774AE]" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <NavBar />
    </>
  );
}
