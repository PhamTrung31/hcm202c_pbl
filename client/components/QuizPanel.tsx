import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveQuizResultRequest, SaveQuizResultResponse, QuizQuestion, GetQuizQuestionsResponse, PlayerRank } from "@shared/api";
import Leaderboard from "./Leaderboard";

export default function QuizPanel() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]); // Changed to string[] for option IDs
  const [playerName, setPlayerName] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [playerRank, setPlayerRank] = useState<PlayerRank | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const quizCount = 12; // Fixed to 12 questions
  
  const done = i >= questions.length;
  const score = useMemo(
    () =>
      answers.reduce(
        (acc, answer, idx) => (answer === questions[idx]?.correctAnswer ? acc + 1 : acc),
        0,
      ),
    [answers, questions],
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

  // Load random quiz questions from API
  const loadQuestions = async (count: number) => {
    setIsLoadingQuestions(true);
    setLoadError("");
    
    try {
      const response = await fetch(`/api/quiz/questions?count=${count}&random=true`);
      const result: GetQuizQuestionsResponse = await response.json();
      
      if (result.success && result.data) {
        setQuestions(result.data);
      } else {
        setLoadError(result.message || "Không thể tải câu hỏi");
      }
    } catch (error) {
      console.error('Lỗi khi tải câu hỏi:', error);
      setLoadError("Có lỗi xảy ra khi tải câu hỏi");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const startQuiz = async () => {
    if (!playerName.trim()) {
      alert("Vui lòng nhập tên của bạn!");
      return;
    }
    
    // Load questions first
    await loadQuestions(quizCount);
    setIsStarted(true);
    setStartTime(new Date());
  };

  const choose = (optionId: string) => {
    if (done) return;
    setAnswers((a) => [...a, optionId]);
    
    // Nếu là câu cuối, set thời gian kết thúc
    if (i === questions.length - 1) {
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
        totalQuestions: questions.length,
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
        if (result.rank) {
          setPlayerRank(result.rank);
        }
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
    setQuestions([]);
    setLoadError("");
    setPlayerRank(null);
  };

  // Auto save khi hoàn thành quiz
  useEffect(() => {
    if (done && endTime && playerName && !saveMessage && questions.length > 0) {
      saveResult();
    }
  }, [done, endTime, playerName, questions.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black text-white p-6">
      {!isStarted ? (
        // Màn hình nhập tên
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-center">Quiz Tư tưởng Hồ Chí Minh</h2>
          <p className="mt-2 text-white/80 text-center">
            Hãy nhập tên của bạn để bắt đầu làm quiz (12 câu hỏi)
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
          
          {loadError && (
            <div className="mt-4 text-red-400 text-center text-sm">
              {loadError}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button
              onClick={startQuiz}
              disabled={!playerName.trim() || isLoadingQuestions}
              className="bg-cyan-400 text-slate-900 hover:bg-cyan-500"
            >
              {isLoadingQuestions ? "Đang tải câu hỏi..." : "Bắt đầu Quiz"}
            </Button>
            <Button
              onClick={() => setShowLeaderboard(true)}
              className="ml-3 bg-purple-500 text-white hover:bg-purple-600"
            >
              🏆 Bảng xếp hạng
            </Button>
          </div>
        </div>
      ) : !done && questions.length > 0 ? (
        // Màn hình câu hỏi
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex justify-between items-center text-sm text-white/70">
            <span>Câu {i + 1} / {questions.length}</span>
            <span>Người chơi: {playerName}</span>
          </div>
          <div className="mt-2 mb-4">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-cyan-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((i + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <h2 className="mt-2 text-xl font-semibold leading-relaxed">{questions[i].question}</h2>
          <div className="mt-6 grid gap-3">
            {questions[i].options.map((option) => (
              <button
                key={option.id}
                onClick={() => choose(option.id)}
                className="w-full rounded-xl bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition-colors border border-white/5 hover:border-white/10"
              >
                <span className="font-medium text-cyan-300">{option.id}.</span> {option.text}
              </button>
            ))}
          </div>
        </div>
      ) : done && questions.length > 0 ? (
        // Màn hình kết quả
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <h2 className="text-2xl font-semibold">🎉 Kết quả của {playerName}</h2>
          <div className="mt-6 space-y-4">
            <div className="text-4xl font-bold text-cyan-400">
              {score}/{questions.length}
            </div>
            <div className="text-white/80 space-y-2">
              <p>📊 Tỷ lệ đúng: {((score / questions.length) * 100).toFixed(1)}%</p>
              <p>⏱️ Thời gian: {formatDuration(duration)}</p>
              <p>🎯 Trung bình: {duration > 0 ? (duration / questions.length).toFixed(1) + "s/câu" : "N/A"}</p>
              
              {/* Hiển thị hạng nếu có */}
              {playerRank && (
                <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-medium">🏆 Hạng của bạn</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      playerRank.rankCategory === 'Xuất sắc' ? 'bg-yellow-500 text-yellow-900' :
                      playerRank.rankCategory === 'Giỏi' ? 'bg-green-500 text-green-900' :
                      playerRank.rankCategory === 'Khá' ? 'bg-blue-500 text-blue-900' :
                      playerRank.rankCategory === 'Trung bình' ? 'bg-orange-500 text-orange-900' :
                      'bg-red-500 text-red-900'
                    }`}>
                      {playerRank.rankCategory}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>📍 Hạng #{playerRank.currentRank} / {playerRank.totalPlayers} người chơi</p>
                    <p>📈 Top {100 - playerRank.percentile}% ({playerRank.percentile}% điểm)</p>
                    {playerRank.isPersonalBest && (
                      <p className="text-yellow-400">⭐ Kỷ lục cá nhân mới!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
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
      ) : (
        // Loading state
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-white/80">Đang tải câu hỏi...</p>
        </div>
      )}
      
      {/* Hiển thị Leaderboard khi được yêu cầu */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
    </div>
  );
}
