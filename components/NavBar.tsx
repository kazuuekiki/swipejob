"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Send, MessageCircle } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: Home, label: "ホーム" },
    { href: "/student/favorites", icon: Heart, label: "気になる" },
    { href: "/student/applications", icon: Send, label: "応募履歴" },
    { href: "/student/matches", icon: MessageCircle, label: "メッセージ" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                isActive ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
