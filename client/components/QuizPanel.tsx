import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Q = { id: string; q: string; choices: string[]; correct: number };

const QUESTIONS: Q[] = [
  {
    id: "q1",
    q: "Thủ đô của Việt Nam là?",
    choices: ["TP.HCM", "Hà Nội", "Đà Nẵng", "Huế"],
    correct: 1,
  },
  {
    id: "q2",
    q: "Paris thuộc quốc gia nào?",
    choices: ["Tây Ban Nha", "Italy", "Pháp", "Đức"],
    correct: 2,
  },
  {
    id: "q3",
    q: "Tokyo là thành phố của?",
    choices: ["Hàn Quốc", "Nhật Bản", "Trung Quốc", "Thái Lan"],
    correct: 1,
  },
];

export default function QuizPanel() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const done = i >= QUESTIONS.length;
  const score = useMemo(
    () =>
      answers.reduce(
        (acc, a, idx) => (a === QUESTIONS[idx].correct ? acc + 1 : acc),
        0,
      ),
    [answers],
  );

  const choose = (idx: number) => {
    if (done) return;
    setAnswers((a) => [...a, idx]);
    setTimeout(() => setI((x) => x + 1), 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black text-white p-6">
      {!done ? (
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="text-sm text-white/70">
            Câu {i + 1} / {QUESTIONS.length}
          </div>
          <h2 className="mt-2 text-2xl font-semibold">{QUESTIONS[i].q}</h2>
          <div className="mt-4 grid gap-3">
            {QUESTIONS[i].choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-left hover:bg-white/15"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <h2 className="text-2xl font-semibold">Kết quả</h2>
          <p className="mt-2 text-white/80">
            Bạn đúng {score}/{QUESTIONS.length} câu.
          </p>
          <div className="mt-4">
            <Button
              onClick={() => {
                setI(0);
                setAnswers([]);
              }}
              className="bg-cyan-400 text-slate-900"
            >
              Làm lại
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
