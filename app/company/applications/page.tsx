"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Check, X, MessageCircle } from "lucide-react";

interface Application {
  id: number;
  status: string;
  message: string;
  createdAt: string;
  student: {
    id: number;
    name: string;
    school: string;
    graduationYear: number;
    bio: string;
  };
}

const statusLabel: Record<string, { label: string; color: string }> = {
  applied: { label: "応募済み", color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "確認中", color: "bg-yellow-100 text-yellow-700" },
  matched: { label: "マッチ!", color: "bg-green-100 text-green-700" },
  rejected: { label: "見送り", color: "bg-gray-100 text-gray-500" },
};

export default function CompanyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company/applications")
      .then((r) => r.json())
      .then((d) => { setApplications(d); setLoading(false); });
  }, []);

  const action = async (applicationId: number, act: "approve" | "reject") => {
    await fetch("/api/company/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, action: act }),
    });
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId ? { ...a, status: act === "approve" ? "matched" : "rejected" } : a
      )
    );
  };

  if (loading) return (
    <>
      <NavBar />
      <div className="pt-14 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  return (
    <>
      <NavBar />
      <main className="pt-14 max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-black text-gray-800 mb-4">応募一覧</h1>
        {applications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📥</p>
            <p>まだ応募がありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const s = statusLabel[app.status] || statusLabel.applied;
              const isActionable = app.status === "applied" || app.status === "reviewing";
              return (
                <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{app.student.name}</h3>
                      <p className="text-xs text-gray-400">{app.student.school} · {app.student.graduationYear}年卒</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                  </div>
                  {app.student.bio && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-gray-400 mb-1">自己紹介</p>
                      <p className="text-sm text-gray-600">{app.student.bio}</p>
                    </div>
                  )}
                  {app.message && (
                    <div className="bg-indigo-50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-indigo-400 mb-1">応募理由</p>
                      <p className="text-sm text-gray-700">{app.message}</p>
                    </div>
                  )}
                  {isActionable && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => action(app.id, "reject")}
                        className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" /> 見送り
                      </button>
                      <button
                        onClick={() => action(app.id, "approve")}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-xl text-sm hover:bg-green-600"
                      >
                        <Check className="w-4 h-4" /> 承認
                      </button>
                    </div>
                  )}
                  {app.status === "matched" && (
                    <button
                      onClick={() => {
                        // Navigate to chat — we need the match ID
                        fetch("/api/matches")
                          .then((r) => r.json())
                          .then((matches: { id: number; studentId: number }[]) => {
                            const match = matches.find((m) => m.studentId === app.student.id);
                            if (match) router.push(`/company/chat/${match.id}`);
                          });
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-2 rounded-xl text-sm mt-3 hover:bg-indigo-100"
                    >
                      <MessageCircle className="w-4 h-4" /> チャットする
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
