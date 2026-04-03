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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-8">
        <div className="text-5xl mb-4">🎉</div>
        <p className="text-xl font-bold text-gray-700 mb-2">全部見ました！</p>
        <p className="text-sm text-gray-400">また後で確認してみてください</p>
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
  const rotation = dragging ? `${dragX * 0.08}deg` : "0deg";
  const opacity = dragging ? Math.max(0.8, 1 - Math.abs(dragX) / 400) : 1;

  const likeOpacity = dragging && dragX > 20 ? Math.min(1, (dragX - 20) / 60) : 0;
  const skipOpacity = dragging && dragX < -20 ? Math.min(1, (-dragX - 20) / 60) : 0;

  return (
    <div className="flex flex-col items-center select-none h-[calc(100vh-72px)]">
      {/* Card */}
      <div
        className="relative w-full max-w-sm cursor-pointer active:cursor-grabbing flex-1 min-h-0"
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
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-white h-full flex flex-col">
          {/* Logo area */}
          <div
            className="flex-1 flex items-center justify-center text-white text-7xl font-bold relative min-h-0"
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
              <p className="text-sm text-indigo-600 font-medium mb-2">
                {current.profile.catchphrase}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {current.profile?.salary && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">💰 {current.profile.salary}</span>
              )}
              {current.profile?.location && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">📍 {current.profile.location}</span>
              )}
              {current.profile?.employeeCount && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">👥 {current.profile.employeeCount}</span>
              )}
              {current.profile?.industry && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">🏢 {current.profile.industry}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Counter + Buttons */}
      <div className="flex items-center justify-center gap-8 py-2">
        <button
          onClick={() => triggerSwipe("skip")}
          className="w-14 h-14 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        >
          <X className="w-6 h-6 text-red-400" />
        </button>

        <span className="text-xs text-gray-400">{index + 1} / {companies.length}</span>

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
