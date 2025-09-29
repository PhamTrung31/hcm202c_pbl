import React, { useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatbotMessageRequest, ChatbotMessageResponse } from "@shared/api";

interface Message { id: string; role: "user" | "bot"; text: string; }

export default function ChatbotPanel() {
  const [msgs, setMsgs] = useState<Message[]>([
    { id: "m0", role: "bot", text: "Xin chào! Tôi là trợ lý AI chuyên về lịch sử Việt Nam và cuộc đời Chủ tịch Hồ Chí Minh. Bạn có thể hỏi tôi bất kỳ điều gì về hành trình cách mạng của Người!" },
  ]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = async () => {
    const t = text.trim();
    if (!t || isLoading) return;
    
    const userMessageId = `${Date.now()}u`;
    const botMessageId = `${Date.now()}b`;
    
    // Thêm tin nhắn người dùng
    setMsgs((m) => [...m, { id: userMessageId, role: "user", text: t }]);
    setText("");
    setIsLoading(true);

    try {
      // Gọi API chatbot
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: t } as ChatbotMessageRequest),
      });

      const data: ChatbotMessageResponse = await response.json();
      
      if (data.success && data.response) {
        setMsgs((m) => [...m, { id: botMessageId, role: "bot", text: data.response }]);
      } else {
        setMsgs((m) => [...m, { id: botMessageId, role: "bot", text: "Xin lỗi, tôi đang gặp một chút vấn đề. Bạn có thể thử lại không?" }]);
      }
    } catch (error) {
      console.error('Lỗi gọi API chatbot:', error);
      setMsgs((m) => [...m, { id: botMessageId, role: "bot", text: "Xin lỗi, có lỗi xảy ra khi kết nối. Vui lòng thử lại sau!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-center border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur">
      </div>
      
      {/* Messages */}
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 no-scrollbar" ref={listRef}>
        <div className="space-y-4 pb-28 pt-6">
          {msgs.map((m) => (
            <div key={m.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed", m.role === "bot" ? "bg-white/10 backdrop-blur" : "ml-auto bg-cyan-400 text-slate-900")}> 
              {m.text}
            </div>
          ))}
          {isLoading && (
            <div className="max-w-[85%] rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/60"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input */}
      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-3xl px-4 pb-6">
        <div className="flex gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Hỏi về cuộc đời Chủ tịch Hồ Chí Minh..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-white/60 disabled:opacity-50"
          />
          <Button 
            onClick={send} 
            disabled={isLoading || !text.trim()}
            className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 disabled:opacity-50"
          >
            {isLoading ? "..." : "Gửi"}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-white/40">
          Được hỗ trợ bởi Fall25 - Half1 - SE1738 - HCM202 - Nhóm 7. Thông tin dựa trên tài liệu lịch sử
        </p>
      </div>
    </div>
  );
}
