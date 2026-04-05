"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NavBar from "@/components/NavBar";
import { Send, ArrowLeft } from "lucide-react";

interface Message {
  id: number;
  body: string;
  senderId: number;
  senderRole: string;
  createdAt: string;
}

export default function StudentChatPage() {
  const { matchId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const profileId = 1;

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/${matchId}`);
    if (res.ok) setMessages(await res.json());
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await fetch(`/api/messages/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: input }),
    });
    setInput("");
    fetchMessages();
  };

  return (
    <>
      <div className="flex flex-col h-screen max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/40 px-4 py-3.5 flex items-center gap-3 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="font-bold text-gray-800 tracking-tight">チャット</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-gradient-to-b from-gray-50/50 to-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#2774AE]/8 flex items-center justify-center mx-auto mb-3">
                <Send className="w-5 h-5 text-[#2774AE]" />
              </div>
              <p className="text-sm text-gray-400">メッセージを送ってみましょう！</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMine = msg.senderRole === "student" && msg.senderId === profileId;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-relaxed ${
                    isMine
                      ? "bg-[#2774AE] text-white rounded-2xl rounded-br-md shadow-[0_2px_8px_rgba(39,116,174,0.2)]"
                      : "bg-white text-gray-800 border border-gray-100/80 rounded-2xl rounded-bl-md shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  {msg.body}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-white/40 px-4 py-3 flex gap-2.5 shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2774AE]/30 focus:border-[#2774AE]/30 transition-all placeholder:text-gray-300"
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 bg-[#2774AE] rounded-xl flex items-center justify-center shadow-[0_2px_8px_rgba(39,116,174,0.25)] hover:bg-[#1e5f94] active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
