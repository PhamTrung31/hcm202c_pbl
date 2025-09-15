import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-3">404</h1>
        <p className="text-lg text-white/70 mb-5">Không tìm thấy trang</p>
        <a href="/" className="inline-block rounded bg-cyan-400 px-4 py-2 font-medium text-slate-900 hover:bg-cyan-300">
          Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default NotFound;
