import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type ContentSection = {
  id: string;
  title?: string;
  body?: string;
  imageUrl?: string;
};

export type MapPoint = {
  id: string;
  name: string;
  latitude: number; // in degrees
  longitude: number; // in degrees
  summary?: string;
  sections: ContentSection[];
};

export interface MapViewProps {
  points: MapPoint[];
  onSelect: (point: MapPoint) => void;
  className?: string;
}

// We rely on Leaflet loaded via CDN in index.html (L global)
declare const L: any;

function createSquarePolygon(lat: number, lon: number, delta = 0.4) {
  return [
    [lat - delta, lon - delta],
    [lat - delta, lon + delta],
    [lat + delta, lon + delta],
    [lat + delta, lon - delta],
    [lat - delta, lon - delta],
  ];
}

// A very rough polygon approximating Vietnam mainland. This is simplified and not geographically exact,
// but sufficient to render a recognizable filled shape on the map. Coordinates are [lat, lon].
const VIETNAM_POLYGON = [
  [23.4, 102.0],
  [21.5, 104.0],
  [20.0, 105.5],
  [18.0, 106.5],
  [16.0, 107.5],
  [14.0, 108.5],
  [12.0, 109.0],
  [11.0, 109.5],
  [10.0, 109.0],
  [9.0, 108.0],
  [8.0, 106.5],
  [10.0, 105.0],
  [11.5, 104.0],
  [12.5, 104.0],
  [13.5, 104.5],
  [14.5, 105.0],
  [16.0, 104.0],
  [18.5, 103.5],
  [20.0, 104.0],
  [22.0, 104.5],
  [23.4, 102.0],
];

export function MapView({ points, onSelect, className }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);

  // Keep a stable ref to onSelect to avoid reinitializing the map each time parent re-renders
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    async function ensureLoadAndInit() {
      if (!mapRef.current) return;

      // Dynamically load Leaflet via a single UMD script tag. If it's already being loaded, wait for it.
      let L: any = (window as any).L;
      if (typeof L === "undefined") {
        const src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        let existing = document.querySelector<HTMLScriptElement>(
          `script[src="${src}"]`,
        );
        if (existing) {
          // if script exists but L not yet ready, wait for load
          await new Promise<void>((resolve, reject) => {
            if ((window as any).L) return resolve();
            const onLoad = () => resolve();
            existing!.addEventListener("load", onLoad);
            existing!.addEventListener("error", () =>
              reject(new Error("Failed to load Leaflet")),
            );
            // safety timeout
            setTimeout(() => {
              if ((window as any).L) resolve();
            }, 3000);
          });
          L = (window as any).L;
        } else {
          try {
            await new Promise<void>((resolve, reject) => {
              const s = document.createElement("script");
              s.src = src;
              s.async = true;
              s.onload = () => resolve();
              s.onerror = () => reject(new Error("Failed to load Leaflet"));
              document.head.appendChild(s);
            });
            L = (window as any).L;
          } catch (e) {
            if (mapRef.current)
              mapRef.current.innerHTML =
                "<div class='p-6 text-center text-sm'>Không tải được Leaflet. Vui lòng ki��m tra kết nối.</div>";
            return;
          }
        }
      }

      if (cancelled) return;

      // Initialize map centered on the world (small zoom) but keep interactions locked
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        tap: true,
        inertia: false,
      });

      // Ensure the container allows pointer events and touch actions
      try {
        mapRef.current!.style.touchAction = "manipulation";
        mapRef.current!.style.pointerEvents = "auto";
      } catch (e) {}

      // Add OpenStreetMap tiles without horizontal wrapping to avoid repeated worlds
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        noWrap: true,
      }).addTo(map);

      // Ensure the world spans the full viewport width to avoid side gutters
      const baseTileSize = 256; // OSM default tile size
      const minZ = 2;
      const maxZ = 6;
      const keepCenter = () => map.getCenter();
      const fitWorldWidth = () => {
        const width = map.getSize().x || (mapRef.current?.clientWidth ?? 1024);
        let targetZ = Math.ceil(Math.log2(width / baseTileSize));
        targetZ = Math.max(minZ, Math.min(maxZ, targetZ));
        const center = keepCenter();
        if (map.getZoom() !== targetZ) {
          map.setView(center, targetZ, { animate: false });
        }
      };
      fitWorldWidth();
      map.on("resize", fitWorldWidth);

      // We will not draw a Vietnam polygon overlay as requested; keep the map tiles clean.
      // Render every provided point as an interactive marker (including islands).
      points.forEach((p: MapPoint) => {
        const isIsland =
          p.id === "hoangsa" || p.id === "truongsa" || p.id === "phuquoc";
        const marker = L.circleMarker([p.latitude, p.longitude], {
          radius: isIsland ? 6 : 8,
          color: "#06b6d4",
          weight: 1,
          fillColor: "#06b6d4",
          fillOpacity: 1,
          interactive: true,
        }).addTo(map);
        marker.on("click", (e: any) => {
          e.originalEvent &&
            e.originalEvent.stopPropagation &&
            e.originalEvent.stopPropagation();
          onSelectRef.current(p);
        });
      });

      // Save reference for cleanup
      leafletRef.current = map;

      // Ensure map paint/size is correct after initial render
      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (e) {
          // ignore
        }
      }, 100);
    }

    ensureLoadAndInit();

    return () => {
      cancelled = true;
      try {
        leafletRef.current?.remove();
      } catch (e) {}
      leafletRef.current = null;
    };
  }, [points]);

  return (
    <div
      className={cn("fixed inset-0 w-full h-full z-0", className)}
      aria-label="Bản đồ thế giới"
    >
      <div ref={mapRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute left-4 bottom-6 z-[1000] rounded-full bg-white/90 px-4 py-2 text-sm text-slate-900 shadow">
        Nhấn vào vùng tô để mở nội dung; bản đồ tĩnh (không zoom/pan)
      </div>
    </div>
  );
}

export default MapView;
