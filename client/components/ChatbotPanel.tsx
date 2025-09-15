import React, { useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message { id: string; role: "user" | "bot"; text: string; }

const RULES: { test: (s: string) => boolean; resp: string }[] = [
  { test: (s) => /xin chào|chào/i.test(s), resp: "Xin chào! Mình là trợ lý của bạn." },
  { test: (s) => /việt nam|vn/i.test(s), resp: "Việt Nam là quốc gia Đông Nam Á với nhiều danh lam thắng cảnh." },
  { test: (s) => /hà nội/i.test(s), resp: "Hà Nội: phố cổ, Hồ Gươm, và ẩm thực đặc sắc." },
  { test: (s) => /phú quốc/i.test(s), resp: "Phú Quốc nổi tiếng với bãi biển đẹp và hải sản tươi ngon." },
];

function replyTo(input: string) {
  const r = RULES.find((r) => r.test(input));
  return r?.resp || "Mình chưa có câu trả lời cho câu hỏi này, bạn có thể hỏi cách khác nhé!";
}

export default function ChatbotPanel() {
  const [msgs, setMsgs] = useState<Message[]>([
    { id: "m0", role: "bot", text: "Xin chào! Hãy đặt câu hỏi của bạn." },
  ]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const id = `${Date.now()}`;
    const bot = replyTo(t);
    setMsgs((m) => [...m, { id: id + "u", role: "user", text: t }, { id: id + "b", role: "bot", text: bot }]);
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-slate-900 to-black text-white">
      <div className="mx-auto mt-16 w-full max-w-3xl flex-1 overflow-y-auto px-4 no-scrollbar" ref={listRef}>
        <div className="space-y-3 pb-28 pt-6">
          {msgs.map((m) => (
            <div key={m.id} className={cn("max-w-[85%] rounded-2xl px-4 py-3", m.role === "bot" ? "bg-white/10" : "ml-auto bg-cyan-400 text-slate-900")}> 
              {m.text}
            </div>
          ))}
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-3xl px-4 pb-6">
        <div className="flex gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Nhập câu hỏi..."
            className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-white/60"
          />
          <Button onClick={send} className="bg-cyan-400 text-slate-900">Gửi</Button>
        </div>
      </div>
    </div>
  );
}
