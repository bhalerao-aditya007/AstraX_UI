// src/components/dashboard/analytics/GeoLocationView.tsx
//
// Still an offline pseudo-map (air-gapped: no tile server, ever). Redesigned
// as a *plotting plate*: graticule, range rings, a drawn route with a
// travelling dot, and markers that use the same geometry language as the
// knowledge-graph nodes. Optional terrain texture at /textures/map-terrain.jpg
// degrades silently to the gradient beneath it.

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { mockGeoLocation } from "../../../data/mockCaseData";
import Icon from "../../ui/Icon";
import Chip, { Kicker } from "../../ui/Chip";
import SourceCitationPopover from "../../ui/SourceCitationPopover";
import { useMotionOK } from "../../motion";

export default function GeoLocationView({ onSelect }: { onSelect?: (item: any) => void }) {
    const [selectedId, setSelectedId] = useState<string | null>("geo-1");
    const motionOK = useMotionOK();

    const sortedPoints = useMemo(
        () =>
            [...mockGeoLocation].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            ),
        []
    );

    const lats = mockGeoLocation.map((g) => g.lat);
    const lngs = mockGeoLocation.map((g) => g.lng);
    const minLat = Math.min(...lats) - 0.015;
    const maxLat = Math.max(...lats) + 0.015;
    const minLng = Math.min(...lngs) - 0.015;
    const maxLng = Math.max(...lngs) + 0.015;

    const selectedPoint = mockGeoLocation.find((g) => g.id === selectedId);

    const handleSelect = (point: (typeof mockGeoLocation)[0]) => {
        setSelectedId(point.id);
        onSelect?.({
            id: point.id,
            label: point.label,
            type: point.type,
            details: {
                entity: point.entity,
                lat: point.lat.toFixed(4),
                lng: point.lng.toFixed(4),
                timestamp: new Date(point.timestamp).toLocaleString(),
                ...(point as any).details,
            },
            citation: (point as any).citation,
            merge_reason: `Geospatial coordinate match at [${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}]`,
        });
    };

    const projectedPoints = useMemo(
        () =>
            sortedPoints.map((point) => ({
                ...point,
                x: ((point.lng - minLng) / (maxLng - minLng)) * 100,
                y: ((maxLat - point.lat) / (maxLat - minLat)) * 100,
            })),
        [sortedPoints, minLat, maxLat, minLng, maxLng]
    );

    const routeD = projectedPoints
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    const markerTone = (type: string) =>
        type === "incident"
            ? { ring: "border-red-400", fill: "bg-red-500", tone: "risk" as const }
            : type === "residence"
              ? { ring: "border-steel-300", fill: "bg-steel-400", tone: "steel" as const }
              : type === "financial" || type === "communication"
                ? { ring: "border-amber-400", fill: "bg-amber-500", tone: "alert" as const }
                : { ring: "border-surface-400", fill: "bg-surface-500", tone: "neutral" as const };

    return (
        <div className="bg-map-plate relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-surface-300">
            <div className="bg-tactical-grid pointer-events-none absolute inset-0 opacity-40" />

            {/* Range rings — a plotting plate, not a gradient */}
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
            >
                {[14, 28, 42].map((r) => (
                    <ellipse
                        key={r}
                        cx="50"
                        cy="50"
                        rx={r}
                        ry={r * 0.78}
                        fill="none"
                        stroke="rgba(95,134,170,0.35)"
                        strokeWidth="0.15"
                        strokeDasharray="1 1.4"
                    />
                ))}
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(95,134,170,0.22)" strokeWidth="0.12" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(95,134,170,0.22)" strokeWidth="0.12" />
            </svg>

            {/* Legend card */}
            <div className="glass absolute left-4 top-4 z-20 max-w-xs rounded-xl p-3">
                <Kicker tone="ember">Movement intelligence</Kicker>
                <h3 className="mt-1.5 font-display text-[13px] font-bold tracking-tight text-surface-900">
                    Route vector & incident plot
                </h3>
                <p className="mt-1 font-mono text-[10px] text-surface-500">
                    Sequential tracing between corroborated surveillance pings
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-surface-300/70 pt-2">
                    <Chip tone="steel" size="xs" dot>
                        residence
                    </Chip>
                    <Chip tone="risk" size="xs" dot>
                        incident
                    </Chip>
                    <Chip tone="alert" size="xs" dot>
                        ping / ATM
                    </Chip>
                </div>
            </div>

            {/* Plot area */}
            <div className="relative h-full min-h-[380px] w-full flex-1">
                <svg
                    className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a85b3a" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#5f86aa" stopOpacity="0.9" />
                        </linearGradient>
                    </defs>

                    {routeD && (
                        <>
                            <motion.path
                                d={routeD}
                                fill="none"
                                stroke="url(#routeGradient)"
                                strokeWidth="0.45"
                                strokeDasharray="1.6 1.4"
                                vectorEffect="non-scaling-stroke"
                                initial={motionOK ? { pathLength: 0, opacity: 0 } : false}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                            {motionOK && (
                                <motion.circle
                                    r="0.75"
                                    fill="#e7b394"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <animateMotion
                                        dur="7s"
                                        repeatCount="indefinite"
                                        path={routeD}
                                        rotate="auto"
                                    />
                                </motion.circle>
                            )}
                        </>
                    )}
                </svg>

                {projectedPoints.map((point, idx) => {
                    const tone = markerTone(point.type);
                    const isSelected = selectedId === point.id;
                    return (
                        <div
                            key={point.id}
                            className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            onClick={() => handleSelect(point)}
                        >
                            {point.type === "incident" && motionOK && (
                                <span className="absolute inset-0 animate-ping rounded-full bg-red-500/50" />
                            )}

                            <div
                                className={`relative flex items-center justify-center rounded-full border-2 border-surface-0 transition-all duration-200 ${tone.fill} ${
                                    isSelected
                                        ? "h-6 w-6 scale-110 ring-2 ring-ember-400 ring-offset-2 ring-offset-surface-0"
                                        : "h-5 w-5 group-hover:scale-110"
                                }`}
                            >
                                <span className="font-mono text-[9px] font-bold text-surface-0">
                                    {idx + 1}
                                </span>
                            </div>

                            <div className="glass-strong pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold text-surface-900 opacity-0 transition-opacity group-hover:opacity-100">
                                {point.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail strip */}
            {selectedPoint && (
                <motion.div
                    key={selectedPoint.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-strong absolute bottom-3 left-3 right-3 z-30 flex flex-col items-start justify-between gap-3 rounded-xl p-3.5 text-xs sm:flex-row sm:items-center"
                >
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-sm font-bold text-surface-900">
                                {selectedPoint.label}
                            </span>
                            <Chip tone={markerTone(selectedPoint.type).tone} size="xs">
                                {selectedPoint.type}
                            </Chip>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-surface-500">
                            <span>
                                Subject{" "}
                                <strong className="text-surface-700">{selectedPoint.entity}</strong>
                            </span>
                            {selectedPoint.details && (
                                <>
                                    <span className="opacity-40">·</span>
                                    <span>{String(Object.values(selectedPoint.details)[0])}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-right font-mono">
                        <div>
                            <div className="text-xs font-bold text-ember-300">
                                {new Date(selectedPoint.timestamp).toLocaleString()}
                            </div>
                            <div className="mt-0.5 text-[10px] text-surface-500">
                                {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
                            </div>
                        </div>
                        {(selectedPoint as any).citation && (
                            <SourceCitationPopover source={(selectedPoint as any).citation} />
                        )}
                    </div>
                </motion.div>
            )}

            {mockGeoLocation.length === 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center">
                        <Icon name="map-pin" size={22} className="mx-auto text-surface-500" />
                        <p className="mt-2 font-mono text-[11px] text-surface-500">
                            No geotagged exhibits on file
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
