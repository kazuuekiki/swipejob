"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, X } from "lucide-react";

interface Company {
  id: number;
  companyName: string;
  profile: {
    catchphrase: string;
    salary: string;
    location: string;
    employeeCount: string;
    industry: string;
    logoColor: string;
  } | null;
}

interface SwipeCardProps {
  companies: Company[];
  onSwipe: (companyId: number, action: "like" | "skip") => void;
}

export default function SwipeCard({ companies, onSwipe }: SwipeCardProps) {
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const hasDragged = useRef(false);
  const router = useRouter();

  const current = companies[index];

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2774AE]/10 to-[#FFD100]/10 flex items-center justify-center mb-5">
          <span className="text-3xl">&#10024;</span>
        </div>
        <p className="text-lg font-bold text-gray-800 tracking-tight mb-2">全部チェックしました</p>
        <p className="text-sm text-gray-400 leading-relaxed">新しい企業が追加されたら<br />またチェックしてみてください</p>
      </div>
    );
  }

  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    hasDragged.current = false;
    setDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!dragging) return;
    const dx = clientX - startX.current;
    if (Math.abs(dx) > 5) hasDragged.current = true;
    setDragX(dx);
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragX > 80) {
      triggerSwipe("like");
    } else if (dragX < -80) {
      triggerSwipe("skip");
    } else if (!hasDragged.current) {
      router.push(`/companies/${current.id}`);
    }
    setDragX(0);
  };

  const triggerSwipe = (action: "like" | "skip") => {
    onSwipe(current.id, action);
    setIndex((i) => i + 1);
  };

  const logoColor = current.profile?.logoColor || "#6366f1";
  const rotation = dragging ? `${dragX * 0.06}deg` : "0deg";
  const scale = dragging ? 0.98 : 1;

  const likeOpacity = dragging && dragX > 20 ? Math.min(1, (dragX - 20) / 60) : 0;
  const skipOpacity = dragging && dragX < -20 ? Math.min(1, (-dragX - 20) / 60) : 0;

  return (
    <div className="flex flex-col items-center select-none h-[calc(100vh-72px)]">
      {/* Card */}
      <div
        className="relative w-full max-w-sm cursor-pointer active:cursor-grabbing flex-1 min-h-0"
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}) scale(${scale})`,
          transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div className="rounded-[28px] overflow-hidden bg-white h-full flex flex-col shadow-[0_2px_40px_rgba(0,0,0,0.08),0_0px_1px_rgba(0,0,0,0.05)]">
          {/* Logo area */}
          <div
            className="flex-1 flex items-center justify-center text-white relative min-h-0"
            style={{
              background: `linear-gradient(135deg, ${logoColor} 0%, ${logoColor}dd 100%)`,
            }}
          >
            <span className="text-7xl font-bold opacity-90 drop-shadow-sm">
              {current.companyName.charAt(0)}
            </span>
            {/* LIKE stamp */}
            <div
              className="absolute top-6 left-6 border-[3px] border-[#FFD100] text-[#FFD100] text-2xl font-black px-4 py-1 rounded-2xl rotate-[-15deg] tracking-widest"
              style={{ opacity: likeOpacity }}
            >
              LIKE
            </div>
            {/* SKIP stamp */}
            <div
              className="absolute top-6 right-6 border-[3px] border-white/70 text-white/70 text-2xl font-black px-4 py-1 rounded-2xl rotate-[15deg] tracking-widest"
              style={{ opacity: skipOpacity }}
            >
              SKIP
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight mb-1">{current.companyName}</h2>
            {current.profile?.catchphrase && (
              <p className="text-[13px] text-[#2774AE] font-medium mb-3 leading-snug">
                {current.profile.catchphrase}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {current.profile?.salary && (
                <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-[11px] text-gray-500 font-medium">
                  💰 {current.profile.salary}
                </span>
              )}
              {current.profile?.location && (
                <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-[11px] text-gray-500 font-medium">
                  📍 {current.profile.location}
                </span>
              )}
              {current.profile?.employeeCount && (
                <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-[11px] text-gray-500 font-medium">
                  👥 {current.profile.employeeCount}
                </span>
              )}
              {current.profile?.industry && (
                <span className="bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-[11px] text-gray-500 font-medium">
                  🏢 {current.profile.industry}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Counter + Buttons */}
      <div className="flex items-center justify-center gap-6 py-3">
        <button
          onClick={() => triggerSwipe("skip")}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/80 hover:scale-110 active:scale-90 transition-transform duration-200"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <span className="text-[11px] text-gray-300 font-medium tracking-wider tabular-nums min-w-[40px] text-center">
          {index + 1} / {companies.length}
        </span>

        <button
          onClick={() => triggerSwipe("like")}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2774AE] to-[#1e5f94] flex items-center justify-center shadow-[0_4px_16px_rgba(39,116,174,0.3)] hover:scale-110 active:scale-90 transition-transform duration-200"
        >
          <Heart className="w-6 h-6 text-[#FFD100]" />
        </button>
      </div>
    </div>
  );
}
