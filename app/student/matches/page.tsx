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
      <NavBar />
      <main className="pt-14 max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-black text-gray-800 mb-4">マッチした企業</h1>
        {matches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💌</p>
            <p>まだマッチしていません</p>
            <p className="text-xs mt-1">企業が応募を承認するとマッチします</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const company = match.application.company;
              const logoColor = company.profile?.logoColor || "#6366f1";
              return (
                <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: logoColor }}
                  >
                    {company.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{company.companyName}</h3>
                    <p className="text-xs text-gray-400">{company.profile?.industry}</p>
                    <p className="text-xs text-green-500 font-medium mt-0.5">マッチしました！</p>
                  </div>
                  <button
                    onClick={() => router.push(`/student/chat/${match.id}`)}
                    className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
