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

export default function CompanyChatPage() {
  const { matchId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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
      <NavBar />
      <div className="pt-14 flex flex-col h-screen max-w-md mx-auto">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h2 className="font-bold text-gray-800">学生とのチャット</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">メッセージを送ってみましょう！</p>
          )}
          {messages.map((msg) => {
            const isMine = msg.senderRole === "company";
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {msg.body}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
