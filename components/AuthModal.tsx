"use client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  redirectTo?: string;
}

export default function AuthModal({ onClose, redirectTo }: AuthModalProps) {
  const router = useRouter();

  const go = (path: string) => {
    const url = redirectTo
      ? `${path}?redirect=${encodeURIComponent(redirectTo)}`
      : path;
    router.push(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">登録が必要です</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-6 text-center">
          応募するには無料登録またはログインが必要です
        </p>
        <div className="space-y-3">
          <button
            onClick={() => go("/auth/register")}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-semibold text-base hover:bg-indigo-700"
          >
            無料で登録する
          </button>
          <button
            onClick={() => go("/auth/login")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold text-base hover:bg-gray-50"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
}
