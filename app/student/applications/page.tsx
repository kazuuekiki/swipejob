"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

interface Application {
  id: number;
  status: string;
  message: string;
  createdAt: string;
  company: {
    companyName: string;
    profile: { catchphrase: string; industry: string; logoColor: string } | null;
  };
}

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  applied: { label: "応募済み", color: "text-[#2774AE]", bg: "bg-[#2774AE]/8" },
  reviewing: { label: "確認中", color: "text-amber-600", bg: "bg-amber-50" },
  matched: { label: "マッチ!", color: "text-emerald-600", bg: "bg-emerald-50" },
  rejected: { label: "見送り", color: "text-gray-400", bg: "bg-gray-50" },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/applications").then((r) => r.json()).then(setApplications);
    fetch("/api/apply/remaining").then((r) => r.json()).then((d) => setRemaining(d.remaining));
  }, []);

  return (
    <>
      <main className="pb-20 max-w-md mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">応募履歴</h1>
          {remaining !== null && (
            <span className="text-[11px] bg-[#2774AE]/8 text-[#2774AE] px-3 py-1.5 rounded-full font-semibold">
              今日あと{remaining}件
            </span>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-[15px] font-semibold text-gray-700 mb-1">まだ応募していません</p>
            <a href="/" className="mt-4 inline-block text-[#2774AE] font-semibold text-sm">企業を探す →</a>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, i) => {
              const s = statusLabel[app.status] || statusLabel.applied;
              return (
                <div
                  key={app.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 animate-fade-in-up shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-[15px] tracking-tight">{app.company.companyName}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{app.company.profile?.industry}</p>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${s.color} ${s.bg}`}>{s.label}</span>
                  </div>
                  {app.message && (
                    <p className="text-[11px] text-gray-500 bg-gray-50/80 rounded-xl p-2.5 mt-2 line-clamp-2 leading-relaxed">{app.message}</p>
                  )}
                  <p className="text-[11px] text-gray-300 mt-2.5 font-medium">
                    {new Date(app.createdAt).toLocaleDateString("ja-JP")}
                  </p>
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
