// src/components/dashboard/analytics/TimelineView.tsx
// Props and data handling unchanged; presentation rebuilt as a drawn thread
// with events settling onto it.

import { useState } from "react";
import { formatLocationString } from "../../../utils/factSheetSynthesizer";
import { mockTimeline } from "../../../data/mockCaseData";
import ConfidenceBadge from "../../ui/ConfidenceBadge";
import SourceCitationPopover from "../../ui/SourceCitationPopover";
import Icon from "../../ui/Icon";
import Chip, { Kicker } from "../../ui/Chip";
import EmptyState from "../../ui/EmptyState";
import { RevealGroup, RevealItem } from "../../motion";
import { USE_MOCK_API } from "../../../config";

interface TimelineViewProps {
    onSelect?: (item: any) => void;
    events?: typeof mockTimeline;
}

const FILTERS = [
    { value: "all", label: "All channels" },
    { value: "incident", label: "Incident / recovery" },
    { value: "financial", label: "Financial" },
    { value: "communication", label: "Communications" },
    { value: "movement", label: "Movement" },
];

export default function TimelineView({ onSelect, events }: TimelineViewProps) {
    const [filter, setFilter] = useState("all");
    const activeEvents = events !== undefined ? events : USE_MOCK_API ? mockTimeline : [];

    const filtered =
        filter === "all" ? activeEvents : activeEvents.filter((t: any) => t.type === filter);

    const sorted = [...filtered].sort(
        (a: any, b: any) =>
            new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );

    const toneFor = (type: string) =>
        type === "financial"
            ? "confirmed"
            : type === "communication"
              ? "hypothesis"
              : type === "movement"
                ? "steel"
                : "risk";

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-surface-300 pb-3 sm:flex-row sm:items-center">
                <div>
                    <Kicker tone="ember">Chronology</Kicker>
                    <p className="mt-1.5 text-xs text-surface-500">
                        Verified sequence of physical and digital incidents, cross-referenced with
                        forensic timestamps.
                    </p>
                </div>

                <label className="flex items-center gap-2 font-mono text-[11px] text-surface-500">
                    <Icon name="filter" size={12} />
                    <select
                        className="cursor-pointer rounded-md border border-surface-300 bg-surface-100 px-2 py-1 font-mono text-[11px] text-surface-700 outline-none focus:border-ember-500/70"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        {FILTERS.map((f) => (
                            <option key={f.value} value={f.value}>
                                {f.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {sorted.length === 0 ? (
                <EmptyState
                    icon="clock"
                    title="No chronological events recorded"
                    body="Timestamps from ingested FIR occurrences, call data records and transaction sequences assemble here in order."
                    stamp="timeline empty"
                />
            ) : (
                <RevealGroup className="relative ml-3 space-y-3 border-l border-surface-300 pl-7">
                    {sorted.map((event: any) => (
                        <RevealItem
                            key={event.id}
                            onClick={() =>
                                onSelect?.({
                                    id: event.id,
                                    label: event.description || event.summary || event.title,
                                    type: event.type,
                                    confidence: event.confidence,
                                    details: {
                                        date: event.date,
                                        time: event.time,
                                        entity: event.entity || event.primaryEntity,
                                        location: event.location,
                                        ...(event as any).details,
                                    },
                                    citation: (event as any).citation,
                                    merge_reason: `Timeline event logged at ${event.date} ${event.time} under ${event.type}`,
                                })
                            }
                            className="group relative cursor-pointer rounded-xl border border-surface-300 bg-surface-0/50 p-4 transition-all hover:border-ember-500/40 hover:bg-surface-100/70"
                        >
                            <span className="absolute -left-[35px] top-5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-ember-500 bg-surface-0 transition-transform group-hover:scale-125" />

                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <Chip tone={toneFor(event.type) as any} size="xs">
                                        {event.type}
                                    </Chip>
                                    <span className="text-sm font-semibold text-surface-900">
                                        {event.entity || event.primaryEntity}
                                    </span>
                                </div>
                                <div className="shrink-0 text-right font-mono text-[11px]">
                                    <span className="font-semibold text-surface-700">{event.date}</span>
                                    <span className="ml-1.5 font-bold text-ember-300">
                                        {event.time} IST
                                    </span>
                                </div>
                            </div>

                            <p className="mt-2 text-xs leading-relaxed text-surface-600">
                                {event.description || event.summary || event.title}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between border-t border-surface-300/60 pt-2 text-xs">
                                <div className="flex items-center gap-3 font-mono text-[11px] text-surface-500">
                                    <span className="flex items-center gap-1">
                                        <Icon name="map-pin" size={11} />
                                        {formatLocationString(event.location)}
                                    </span>
                                    <ConfidenceBadge score={event.confidence} size="sm" />
                                </div>
                                {(event as any).citation && (
                                    <SourceCitationPopover source={(event as any).citation} />
                                )}
                            </div>
                        </RevealItem>
                    ))}
                </RevealGroup>
            )}
        </div>
    );
}
