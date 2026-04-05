"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Check } from "lucide-react";

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

const STEPS = [
  { key: "applied", label: "応募済み" },
  { key: "reviewing", label: "書類確認中" },
  { key: "interview", label: "面接" },
  { key: "matched", label: "マッチ" },
];

function getStepIndex(status: string): number {
  if (status === "rejected") return -1;
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function ProgressBar({ status }: { status: string }) {
  const isRejected = status === "rejected";
  const current = getStepIndex(status);

  return (
    <div className="mt-3 mb-1">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-3 left-[12%] right-[12%] h-[2px] bg-gray-100 z-0" />
        {/* Active line */}
        {!isRejected && current > 0 && (
          <div
            className="absolute top-3 left-[12%] h-[2px] bg-[#2774AE] z-0 transition-all duration-500"
            style={{ width: `${(current / (STEPS.length - 1)) * 76}%` }}
          />
        )}

        {STEPS.map((step, i) => {
          const isDone = !isRejected && i <= current;
          const isCurrent = !isRejected && i === current;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-[#2774AE] text-white shadow-[0_1px_6px_rgba(39,116,174,0.3)]"
                    : "bg-gray-100 text-gray-400"
                } ${isCurrent ? "ring-2 ring-[#2774AE]/20 ring-offset-1" : ""}`}
              >
                {isDone && i < current ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-medium ${isDone ? "text-[#2774AE]" : "text-gray-300"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isRejected && (
        <p className="text-[11px] text-center text-gray-400 mt-2">選考は終了しました</p>
      )}
    </div>
  );
}

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
              return (
                <div
                  key={app.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/60 animate-fade-in-up shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-[15px] tracking-tight">{app.company.companyName}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{app.company.profile?.industry}</p>
                    </div>
                    <p className="text-[10px] text-gray-300 font-medium">
                      {new Date(app.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>

                  <ProgressBar status={app.status} />
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
