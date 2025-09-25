import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@shared/api";

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch('/api/quiz/results');
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data || []);
      } else {
        setError(data.message || "Không thể tải kết quả");
      }
    } catch (err) {
      console.error('Lỗi khi tải kết quả:', err);
      setError("Có lỗi xảy ra khi tải kết quả");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black text-white p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">🏆 Bảng xếp hạng</h2>
          <Button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            Đóng
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-white/70">Đang tải...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-400">{error}</div>
            <Button
              onClick={fetchResults}
              className="mt-4 bg-cyan-400 text-slate-900"
            >
              Thử lại
            </Button>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            Chưa có kết quả nào
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={result._id}
                  className={`
                    flex items-center justify-between p-4 rounded-xl
                    ${index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' : 
                      index === 1 ? 'bg-gray-300/20 border border-gray-300/30' :
                      index === 2 ? 'bg-amber-600/20 border border-amber-600/30' :
                      'bg-white/5 border border-white/10'}
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-300 text-black' :
                        index === 2 ? 'bg-amber-600 text-white' :
                        'bg-white/20 text-white'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{result.name}</div>
                      <div className="text-sm text-white/70">
                        {formatDate(result.completedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="font-semibold">
                        {result.score}/{result.totalQuestions}
                      </div>
                      <div className="text-sm text-white/70">câu đúng</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {formatDuration(result.duration)}
                      </div>
                      <div className="text-sm text-white/70">thời gian</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </div>
                      <div className="text-sm text-white/70">điểm</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}