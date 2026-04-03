"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Building2, Heart, MessageCircle, LogOut, User } from "lucide-react";

export default function NavBar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          SwipeJob
        </Link>

        <div className="flex items-center gap-3">
          {!session ? (
            <>
              <Link href="/auth/login" className="text-sm text-gray-600 hover:text-indigo-600">
                ログイン
              </Link>
              <Link href="/auth/register" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700">
                登録
              </Link>
            </>
          ) : role === "student" ? (
            <>
              <Link href="/student/applications" title="応募履歴">
                <Building2 className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
              </Link>
              <Link href="/student/matches" title="マッチ">
                <Heart className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} title="ログアウト">
                <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500" />
              </button>
            </>
          ) : role === "company" ? (
            <>
              <Link href="/company/applications" title="応募一覧">
                <User className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
              </Link>
              <Link href="/company/profile" title="プロフィール">
                <Building2 className="w-5 h-5 text-gray-500 hover:text-indigo-600" />
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} title="ログアウト">
                <LogOut className="w-5 h-5 text-gray-500 hover:text-red-500" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
