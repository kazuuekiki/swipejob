"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Heart, ArrowLeft, MapPin, Users, DollarSign, Calendar, Briefcase } from "lucide-react";

interface Company {
  id: number;
  companyName: string;
  email: string;
  profile: {
    description: string;
    industry: string;
    location: string;
    employeeCount: string;
    salary: string;
    catchphrase: string;
    foundedYear: string;
    workStyle: string;
    logoColor: string;
  } | null;
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [message, setMessage] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then((r) => r.json())
      .then(setCompany);
    fetch("/api/apply/remaining")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining));
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleApply = async () => {
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId: id, message }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setApplied(true);
    setShowApplyModal(false);
    setRemaining(data.remaining);
    showToast("応募しました！企業の返答をお待ちください");
  };

  if (!company) {
    return (
      <>
        <NavBar />
        <div className="pt-14 flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#2774AE] border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  const logoColor = company.profile?.logoColor || "#6366f1";

  return (
    <>
      <NavBar />
      <main className="pt-14 max-w-md mx-auto pb-40">
        <div
          className="h-48 flex items-end pb-4 px-4 relative"
          style={{ backgroundColor: logoColor }}
        >
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-white">
            <p className="text-xs text-white/70 mb-1">{company.profile?.industry}</p>
            <h1 className="text-2xl font-black">{company.companyName}</h1>
            {company.profile?.catchphrase && (
              <p className="text-sm text-white/80 mt-1">{company.profile.catchphrase}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          {company.profile?.salary && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-[#2774AE]" />
                <span className="text-xs text-gray-400">初任給</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{company.profile.salary}</p>
            </div>
          )}
          {company.profile?.location && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#2774AE]" />
                <span className="text-xs text-gray-400">勤務地</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{company.profile.location}</p>
            </div>
          )}
          {company.profile?.employeeCount && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#2774AE]" />
                <span className="text-xs text-gray-400">社員数</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{company.profile.employeeCount}</p>
            </div>
          )}
          {company.profile?.foundedYear && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#2774AE]" />
                <span className="text-xs text-gray-400">設立</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{company.profile.foundedYear}</p>
            </div>
          )}
          {company.profile?.workStyle && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-[#2774AE]" />
                <span className="text-xs text-gray-400">働き方</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{company.profile.workStyle}</p>
            </div>
          )}
        </div>

        {company.profile?.description && (
          <div className="mx-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="font-bold text-gray-700 mb-2">会社について</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {company.profile.description}
            </p>
          </div>
        )}

        {remaining !== null && (
          <p className="text-center text-xs text-gray-400 mb-4">
            今日あと <span className="font-bold text-[#2774AE]">{remaining}</span> 件応募できます
          </p>
        )}
      </main>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 py-3 bg-white border-t border-gray-100 z-40">
        {applied ? (
          <div className="w-full bg-green-100 text-green-700 py-3 rounded-2xl font-semibold text-center">
            応募済み
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={async () => {
                await fetch("/api/favorites", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ companyId: id }),
                });
                showToast("気になるに追加しました");
              }}
              className="w-14 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              <Heart className="w-5 h-5 text-pink-400" />
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex-1 bg-[#2774AE] text-white py-3 rounded-2xl font-bold text-base hover:bg-[#1f5d8a]"
            >
              応募する
            </button>
          </div>
        )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-1">{company.companyName} に応募</h2>
            <p className="text-xs text-gray-400 mb-4">応募理由（任意）</p>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="この企業を志望する理由を入力してください（任意）"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <button
              onClick={handleApply}
              className="w-full bg-[#2774AE] text-white py-3 rounded-2xl font-bold hover:bg-[#1f5d8a]"
            >
              応募する
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
