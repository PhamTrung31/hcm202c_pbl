import React, { useEffect, useRef } from "react";
import { MapPoint } from "./MapView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  point: MapPoint;
  onExit: () => void;
}

export default function FullscreenContent({ point, onExit }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // disable interactions on the underlying map container so it cannot cover or receive events
    const mapEl = document.querySelector<HTMLElement>('[aria-label="Bản đồ thế giới"]');
    const prevPointer = mapEl?.style.pointerEvents;
    const prevZ = mapEl?.style.zIndex;
    if (mapEl) {
      mapEl.style.pointerEvents = "none";
      // put map behind overlay (Leaflet may use high z-index); lower it
      mapEl.style.zIndex = "0";
    }

    return () => {
      document.body.style.overflow = prev;
      if (mapEl) {
        mapEl.style.pointerEvents = prevPointer || "";
        mapEl.style.zIndex = prevZ || "";
      }
    };
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            el.dataset.visible = "true";
          } else {
            el.dataset.visible = "false";
          }
        });
      },
      { root, threshold: [0.45, 0.6] },
    );
    sections.forEach((s) => observer.observe(s));

    // Wheel handling: only one page per wheel gesture
    let isThrottled = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isThrottled) return;
      const delta = e.deltaY;
      const currentIndex = sections.findIndex((sec) => sec.dataset.visible === "true");
      let target = currentIndex;
      if (delta > 0) target = Math.min(sections.length - 1, currentIndex + 1);
      else if (delta < 0) target = Math.max(0, currentIndex - 1);
      if (target === currentIndex) return;
      isThrottled = true;
      sections[target].scrollIntoView({ behavior: "smooth" });
      setTimeout(() => (isThrottled = false), 700);
    };
    root.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      root.removeEventListener("wheel", onWheel);
    };
  }, [point]);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col text-white">
      {/* Top-left exit always visible */}
      <div className="absolute left-4 top-4 z-[100000]">
        <Button onClick={onExit} variant="secondary" className="bg-black/40 text-white backdrop-blur border-white/10">
          Thoát
        </Button>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar relative h-full w-full overflow-y-auto snap-y snap-mandatory touch-pan-y"
        aria-label={`Nội dung: ${point.name}`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* For each section we create a full viewport slide with background image */}
        <section
          data-slide
          data-visible="false"
          className="snap-start relative h-screen w-full flex items-end"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 transition-opacity duration-700" />
          <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-24">
            <h1 className="text-4xl font-semibold drop-shadow-lg">{point.name}</h1>
            {point.summary ? <p className="mt-3 max-w-2xl text-white/85">{point.summary}</p> : null}
          </div>
        </section>

        {point.sections.map((s) => (
          <section key={s.id} data-slide data-visible="false" className="snap-start relative h-screen w-full">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 scale-105 transition-all duration-700"
              style={{ backgroundImage: `url(${s.imageUrl || ""})` }}
            />
            <div className="absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-700" />

            <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center px-6">
              <div
                className={cn(
                  "transform transition-all duration-700 ease-out opacity-0 translate-y-6",
                )}
                // Visual state toggled by data-visible attribute via CSS below
              >
                {s.title ? <h2 className="text-3xl font-semibold text-white drop-shadow">{s.title}</h2> : null}
                {s.body ? <p className="mt-4 max-w-3xl text-white/90 leading-relaxed">{s.body}</p> : null}
              </div>
            </div>
          </section>
        ))}

        {/* End: show CTA with exit */}
        <section data-slide data-visible="false" className="snap-start relative h-screen w-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 transition-opacity duration-700" />
          <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
            <h3 className="text-2xl font-semibold">Đã xem hết nội dung</h3>
            <p className="mt-2 text-white/80">Quay lại bản đồ để chọn điểm khác.</p>
            <div className="mt-6">
              <Button onClick={onExit} className="bg-cyan-400 text-slate-900">
                Quay về bản đồ
              </Button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* text/content transition */
        [data-slide] > .relative.z-10 > * {
          transition: opacity 700ms ease, transform 700ms ease;
        }
        [data-slide][data-visible="true"] .relative.z-10 > * {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        [data-slide][data-visible="false"] .relative.z-10 > * {
          opacity: 0 !important;
          transform: translateY(18px) !important;
        }

        /* background and overlay transitions */
        [data-slide] .bg-cover { transition: opacity 700ms ease, transform 700ms ease; }
        [data-slide][data-visible="true"] .bg-cover { opacity: 1 !important; transform: scale(1) !important; }
        [data-slide][data-visible="false"] .bg-cover { opacity: 0 !important; transform: scale(1.05) !important; }

        [data-slide] > .absolute.bg-black\/35 { transition: opacity 700ms ease; }
        [data-slide][data-visible="true"] > .absolute.bg-black\/35 { opacity: 0.35 !important; }
        [data-slide][data-visible="false"] > .absolute.bg-black\/35 { opacity: 0 !important; }
      `}</style>
    </div>
  );
}
