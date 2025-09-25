import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveQuizResultRequest, SaveQuizResultResponse } from "@shared/api";
import Leaderboard from "./Leaderboard";

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
    q: "Tokyo nằm ở quốc gia nào?",
    choices: ["Hàn Quốc", "Nhật Bản", "Trung Quốc", "Thái Lan"],
    correct: 1,
  },
];

export default function QuizPanel() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const done = i >= QUESTIONS.length;
  const score = useMemo(
    () =>
      answers.reduce(
        (acc, a, idx) => (a === QUESTIONS[idx].correct ? acc + 1 : acc),
        0,
      ),
    [answers],
  );

  const duration = useMemo(() => {
    if (startTime && endTime) {
      return Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    }
    return 0;
  }, [startTime, endTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    if (!playerName.trim()) {
      alert("Vui lòng nhập tên của bạn!");
      return;
    }
    setIsStarted(true);
    setStartTime(new Date());
  };

  const choose = (idx: number) => {
    if (done) return;
    setAnswers((a) => [...a, idx]);
    
    // Nếu là câu cuối, set thời gian kết thúc
    if (i === QUESTIONS.length - 1) {
      setEndTime(new Date());
    }
    
    setTimeout(() => setI((x) => x + 1), 250);
  };

  const saveResult = async () => {
    if (!playerName.trim() || !startTime || !endTime) return;
    
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const requestData: SaveQuizResultRequest = {
        name: playerName.trim(),
        score,
        totalQuestions: QUESTIONS.length,
        duration
      };

      const response = await fetch('/api/quiz/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result: SaveQuizResultResponse = await response.json();
      
      if (result.success) {
        setSaveMessage("✅ Kết quả đã được lưu thành công!");
      } else {
        setSaveMessage("❌ " + result.message);
      }
    } catch (error) {
      console.error('Lỗi khi lưu kết quả:', error);
      setSaveMessage("❌ Có lỗi xảy ra khi lưu kết quả");
    } finally {
      setIsSaving(false);
    }
  };

  const resetQuiz = () => {
    setI(0);
    setAnswers([]);
    setPlayerName("");
    setStartTime(null);
    setEndTime(null);
    setIsStarted(false);
    setIsSaving(false);
    setSaveMessage("");
    setShowLeaderboard(false);
  };

  // Auto save khi hoàn thành quiz
  useEffect(() => {
    if (done && endTime && playerName && !saveMessage) {
      saveResult();
    }
  }, [done, endTime, playerName]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black text-white p-6">
      {!isStarted ? (
        // Màn hình nhập tên
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-center">Chào mừng đến với Quiz!</h2>
          <p className="mt-2 text-white/80 text-center">
            Hãy nhập tên của bạn để bắt đầu làm quiz
          </p>
          <div className="mt-4">
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              onKeyPress={(e) => e.key === 'Enter' && startQuiz()}
            />
          </div>
          <div className="mt-4 text-center">
            <Button
              onClick={startQuiz}
              disabled={!playerName.trim()}
              className="bg-cyan-400 text-slate-900 hover:bg-cyan-500"
            >
              Bắt đầu Quiz
            </Button>
            <Button
              onClick={() => setShowLeaderboard(true)}
              className="ml-3 bg-purple-500 text-white hover:bg-purple-600"
            >
              🏆 Bảng xếp hạng
            </Button>
          </div>
        </div>
      ) : !done ? (
        // Màn hình câu hỏi
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex justify-between items-center text-sm text-white/70">
            <span>Câu {i + 1} / {QUESTIONS.length}</span>
            <span>Người chơi: {playerName}</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold">{QUESTIONS[i].q}</h2>
          <div className="mt-4 grid gap-3">
            {QUESTIONS[i].choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-left hover:bg-white/15 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Màn hình kết quả
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <h2 className="text-2xl font-semibold">Kết quả của {playerName}</h2>
          <div className="mt-4 space-y-2 text-white/80">
            <p>Điểm số: {score}/{QUESTIONS.length} câu đúng</p>
            <p>Thời gian: {formatDuration(duration)}</p>
            {saveMessage && (
              <p className="text-sm font-medium">{saveMessage}</p>
            )}
          </div>
          <div className="mt-6 space-x-3">
            {!saveMessage && (
              <Button
                onClick={saveResult}
                disabled={isSaving}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {isSaving ? "Đang lưu..." : "Lưu kết quả"}
              </Button>
            )}
            <Button
              onClick={resetQuiz}
              className="bg-cyan-400 text-slate-900 hover:bg-cyan-500"
            >
              Làm lại
            </Button>
            <Button
              onClick={() => setShowLeaderboard(true)}
              className="bg-purple-500 text-white hover:bg-purple-600"
            >
              🏆 Bảng xếp hạng
            </Button>
          </div>
        </div>
      )}
      
      {/* Hiển thị Leaderboard khi được yêu cầu */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
