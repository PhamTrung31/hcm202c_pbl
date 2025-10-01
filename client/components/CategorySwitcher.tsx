import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type Category = "map" | "chatbot" | "quiz";

interface Props {
  value: Category;
  onChange: (value: Category) => void;
  className?: string;
}

const tabs: { key: Category; label: string }[] = [
  { key: "map", label: "Bản đồ" },
  { key: "chatbot", label: "Chatbot" },
  { key: "quiz", label: "Quiz" },
];

export default function CategorySwitcher({
  value,
  onChange,
  className,
}: Props) {
  const [isFaded, setIsFaded] = useState(false);
  const fadeOutTimer = useRef<NodeJS.Timeout>();

  const startFadeOutTimer = () => {
    clearTimeout(fadeOutTimer.current);

    fadeOutTimer.current = setTimeout(() => {
      setIsFaded(true);
    }, 2000);
  };

  const handleMouseEnter = () => {
    clearTimeout(fadeOutTimer.current);

    setIsFaded(false);
  };

  const handleMouseLeave = () => {
    startFadeOutTimer();
  };

  useEffect(() => {
    startFadeOutTimer();
    return () => clearTimeout(fadeOutTimer.current);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/80 p-1 text-sm text-slate-900 shadow backdrop-blur",
        "transition-opacity duration-500 ease-in-out",
        isFaded ? "opacity-40" : "opacity-100",
        className,
      )}
      role="tablist"
      aria-label="Danh mục"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            value === t.key ? "bg-slate-900 text-white" : "hover:bg-white",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
