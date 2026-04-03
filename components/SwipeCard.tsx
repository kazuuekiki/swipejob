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
  const router = useRouter();

  const current = companies[index];

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-8">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-xl font-bold text-gray-700 mb-2">全部見ました！</p>
        <p className="text-sm text-gray-400">また後で確認してみてください</p>
      </div>
    );
  }

  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    setDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!dragging) return;
    setDragX(clientX - startX.current);
  };

  const handleDragEnd = () => {
    if (!dragging) return;
    setDragging(false);
    if (dragX > 80) {
      triggerSwipe("like");
    } else if (dragX < -80) {
      triggerSwipe("skip");
    }
    setDragX(0);
  };

  const triggerSwipe = (action: "like" | "skip") => {
    onSwipe(current.id, action);
    setIndex((i) => i + 1);
  };

  const logoColor = current.profile?.logoColor || "#6366f1";
  const rotation = dragging ? `${dragX * 0.08}deg` : "0deg";
  const opacity = dragging ? Math.max(0.8, 1 - Math.abs(dragX) / 400) : 1;

  const likeOpacity = dragging && dragX > 20 ? Math.min(1, (dragX - 20) / 60) : 0;
  const skipOpacity = dragging && dragX < -20 ? Math.min(1, (-dragX - 20) / 60) : 0;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Card */}
      <div
        className="relative w-full max-w-sm cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation})`,
          opacity,
          transition: dragging ? "none" : "transform 0.3s ease",
        }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
          {/* Logo area */}
          <div
            className="h-32 flex items-center justify-center text-white text-5xl font-bold relative"
            style={{ backgroundColor: logoColor }}
          >
            <span className="drop-shadow-lg">
              {current.companyName.charAt(0)}
            </span>
            {/* LIKE / SKIP stamps */}
            <div
              className="absolute top-6 left-6 border-4 border-green-400 text-green-400 text-2xl font-black px-3 py-1 rounded-xl rotate-[-15deg]"
              style={{ opacity: likeOpacity }}
            >
              LIKE
            </div>
            <div
              className="absolute top-6 right-6 border-4 border-red-400 text-red-400 text-2xl font-black px-3 py-1 rounded-xl rotate-[15deg]"
              style={{ opacity: skipOpacity }}
            >
              SKIP
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-0.5">{current.companyName}</h2>
            {current.profile?.catchphrase && (
              <p className="text-sm text-indigo-600 font-medium mb-3">
                {current.profile.catchphrase}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {current.profile?.salary && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  💰 {current.profile.salary}
                </span>
              )}
              {current.profile?.location && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  📍 {current.profile.location}
                </span>
              )}
              {current.profile?.employeeCount && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  👥 {current.profile.employeeCount}
                </span>
              )}
              {current.profile?.industry && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  🏢 {current.profile.industry}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Counter */}
      <p className="text-xs text-gray-400 mt-3">
        {index + 1} / {companies.length}
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-6 mt-3">
        <button
          onClick={() => triggerSwipe("skip")}
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          <X className="w-6 h-6 text-red-400" />
        </button>

        <button
          onClick={() => router.push(`/companies/${current.id}`)}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition text-[10px] font-bold text-gray-400"
        >
          詳細
        </button>

        <button
          onClick={() => triggerSwipe("like")}
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          <Heart className="w-6 h-6 text-green-400" />
        </button>
      </div>
    </div>
  );
}
