import React, { useEffect, useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

// Import đúng chuẩn để TS nhận
import * as L from "leaflet";
import type { LatLngExpression } from "leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

export type ContentSection = {
  id: string;
  title?: string;
  body?: string;
  imageUrl?: string;
};

export type MapPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  summary?: string;
  sections: ContentSection[];
  small?: boolean;
};

export type JourneyLeg = {
  startId: string;
  endId: string;
  lineType?: "straight";
  controlPoints?: [number, number][];
};

export interface MapViewProps {
  points: MapPoint[];
  journeyPath: JourneyLeg[];
  onSelect: (point: MapPoint) => void;
  className?: string;
}

const createCircleIcon = (size: number) => {
  const style = `background-color: #06b6d4; width: ${size}px; height: ${size}px; border-radius: 50%; border: 1px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);`;
  return L.divIcon({
    html: `<div style="${style}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: "",
  });
};

const mainIcon = createCircleIcon(12);
const smallIcon = createCircleIcon(8);

function getCurvePoints(
  start: [number, number],
  end: [number, number],
  controlPoints?: [number, number][],
): LatLngExpression[] {
  const points: LatLngExpression[] = [];
  const numberOfSegments = 50;

  if (!controlPoints || controlPoints.length === 0) {
    const offsetX = (end[1] - start[1]) * 0.1;
    const offsetY = (end[0] - start[0]) * 0.1;
    const control: [number, number] = [
      (start[0] + end[0]) / 2 - offsetY,
      (start[1] + end[1]) / 2 + offsetX,
    ];
    for (let i = 0; i <= numberOfSegments; i++) {
      const t = i / numberOfSegments;
      const lat =
        Math.pow(1 - t, 2) * start[0] +
        2 * (1 - t) * t * control[0] +
        Math.pow(t, 2) * end[0];
      const lng =
        Math.pow(1 - t, 2) * start[1] +
        2 * (1 - t) * t * control[1] +
        Math.pow(t, 2) * end[1];
      points.push([lat, lng]);
    }
  } else if (controlPoints.length === 1) {
    const control = controlPoints[0];
    for (let i = 0; i <= numberOfSegments; i++) {
      const t = i / numberOfSegments;
      const lat =
        Math.pow(1 - t, 2) * start[0] +
        2 * (1 - t) * t * control[0] +
        Math.pow(t, 2) * end[0];
      const lng =
        Math.pow(1 - t, 2) * start[1] +
        2 * (1 - t) * t * control[1] +
        Math.pow(t, 2) * end[1];
      points.push([lat, lng]);
    }
  } else if (controlPoints.length === 2) {
    const control1 = controlPoints[0];
    const control2 = controlPoints[1];
    for (let i = 0; i <= numberOfSegments; i++) {
      const t = i / numberOfSegments;
      const lat =
        Math.pow(1 - t, 3) * start[0] +
        3 * Math.pow(1 - t, 2) * t * control1[0] +
        3 * (1 - t) * Math.pow(t, 2) * control2[0] +
        Math.pow(t, 3) * end[0];
      const lng =
        Math.pow(1 - t, 3) * start[1] +
        3 * Math.pow(1 - t, 2) * t * control1[1] +
        3 * (1 - t) * Math.pow(t, 2) * control2[1] +
        Math.pow(t, 3) * end[1];
      points.push([lat, lng]);
    }
  }
  return points;
}

function MapSizer() {
  const map = useMap();
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const baseTileSize = 256;
    const minZ = 3.5;
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
  }, [map]);
  return null;
}

function MapEvents({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) {
  useMapEvents({
    zoomend: (e) => setZoomLevel(e.target.getZoom()),
  });
  return null;
}

const cityLabelStyles = `.city-label { background-color: transparent; border: none; box-shadow: none; color: #333; font-weight: bold; font-size: 12px; text-shadow: 1px 1px 2px white; }`;

const PolylineDecorator = ({
  positions,
  pattern,
}: {
  positions: LatLngExpression[];
  pattern: any;
}) => {
  const map = useMap();
  const decoratorRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (decoratorRef.current) {
      map.removeLayer(decoratorRef.current);
    }
    const decorator = (L as any).polylineDecorator(positions, {
      patterns: [pattern],
    });
    decorator.addTo(map);
    decoratorRef.current = decorator;

    return () => {
      if (decoratorRef.current) {
        map.removeLayer(decoratorRef.current);
      }
    };
  }, [map, positions, pattern]);

  return null;
};

const arrowPattern = {
  offset: "50%",
  repeat: 0,
  symbol: (L as any).Symbol.arrowHead({
    pixelSize: 8,
    polygon: false,
    pathOptions: {
      stroke: true,
      weight: 2,
      color: "#d9534f",
    },
  }),
};

export function MapView({
  points,
  journeyPath,
  onSelect,
  className,
}: MapViewProps) {
  const [zoomLevel, setZoomLevel] = useState(2);
  const pointsById = useMemo(
    () => new Map(points.map((p) => [p.id, p])),
    [points],
  );

  return (
    <div
      className={cn("fixed inset-0 w-full h-full z-0", className)}
      aria-label="Bản đồ thế giới"
    >
      <style>{cityLabelStyles}</style>
      <MapContainer
        className="h-full w-full"
        center={[30, 40] as LatLngExpression}
        zoom={2}
        minZoom={3}
        maxZoom={6}
        zoomControl
        dragging
        scrollWheelZoom
        doubleClickZoom
        touchZoom
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          noWrap
        />

        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude] as LatLngExpression}
            icon={point.small ? smallIcon : mainIcon}
            eventHandlers={{ click: () => onSelect(point) }}
          />
        ))}

        {journeyPath.map((leg) => {
          const startPoint = pointsById.get(leg.startId);
          const endPoint = pointsById.get(leg.endId);
          if (!startPoint || !endPoint) return null;

          const startLatLng: [number, number] = [
            startPoint.latitude,
            startPoint.longitude,
          ];
          const endLatLng: [number, number] = [
            endPoint.latitude,
            endPoint.longitude,
          ];

          const positions: LatLngExpression[] =
            leg.lineType === "straight"
              ? [startLatLng, endLatLng]
              : getCurvePoints(startLatLng, endLatLng, leg.controlPoints);

          return (
            <React.Fragment key={`${leg.startId}-${endPoint.id}`}>
              <Polyline
                positions={positions}
                pathOptions={{ color: "#d9534f", weight: 2, dashArray: "5, 5" }}
              />
              <PolylineDecorator positions={positions} pattern={arrowPattern} />
            </React.Fragment>
          );
        })}

        <MapSizer />
        <MapEvents setZoomLevel={setZoomLevel} />
      </MapContainer>
      <div className="absolute left-4 bottom-6 z-[1000] rounded-full bg-white/90 px-4 py-2 text-sm text-slate-900 shadow font-bold">
        Vị trí các marker chỉ là tương đối và đại diện cho các sự kiện tiêu
        biểu. Có những nơi Bác đi qua không xuất hiện trên bản đồ!
      </div>
    </div>
  );
}
