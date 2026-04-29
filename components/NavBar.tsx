"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, MessageCircle, User } from "lucide-react";

/**
 * 3-tab Instagram-style bottom navigation.
 *  - スワイプ (Home / company swipe)
 *  - メッセージ (Matches / chat)
 *  - 設定 (Profile / resume / photo / favorites & applications shortcuts)
 */
export default function NavBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: Layers, label: "スワイプ" },
    { href: "/student/matches", icon: MessageCircle, label: "メッセージ" },
    { href: "/student/profile", icon: User, label: "設定" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="bg-white/85 backdrop-blur-xl border-t border-white/40 shadow-[0_-1px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center gap-1 px-6 py-2 transition-all duration-200 ${
                  isActive ? "text-[#2774AE]" : "text-gray-350 hover:text-gray-500"
                }`}
              >
                <div className="relative">
                  <tab.icon
                    className={`w-[24px] h-[24px] transition-all duration-200 ${
                      isActive ? "stroke-[2.5]" : "stroke-[1.8]"
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#2774AE]" />
                  )}
                </div>
                <span
                  className={`text-[11px] tracking-wide transition-all duration-200 ${
                    isActive ? "font-semibold" : "font-normal"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
