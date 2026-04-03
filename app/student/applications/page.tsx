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

const statusLabel: Record<string, { label: string; color: string }> = {
  applied: { label: "応募済み", color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "確認中", color: "bg-yellow-100 text-yellow-700" },
  matched: { label: "マッチ!", color: "bg-green-100 text-green-700" },
  rejected: { label: "見送り", color: "bg-gray-100 text-gray-500" },
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
      <main className="pb-16 max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black text-gray-800">応募履歴</h1>
          {remaining !== null && (
            <span className="text-xs bg-[#2774AE]/10 text-[#2774AE] px-3 py-1 rounded-full font-medium">
              今日あと{remaining}件
            </span>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>まだ応募していません</p>
            <a href="/" className="mt-4 inline-block text-[#2774AE] font-medium text-sm">企業を探す →</a>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const s = statusLabel[app.status] || statusLabel.applied;
              return (
                <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800">{app.company.companyName}</h3>
                      <p className="text-xs text-gray-400">{app.company.profile?.industry}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                  </div>
                  {app.message && (
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 mt-2 line-clamp-2">{app.message}</p>
                  )}
                  <p className="text-xs text-gray-300 mt-2">
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
