"use client"

import { Lock, Play, Check } from "lucide-react"
import type { Track } from "@/lib/learn-data"

export function TrackCard({ track, onStart }: { track: Track; onStart?: (track: Track) => void }) {
  const pct = Math.round((track.completed / track.lessons) * 100)
  const done = track.completed === track.lessons
  const locked = track.completed === 0 && track.level === "Advanced"

  return (
    <div className="flex flex-col rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-black">{track.title}</h3>
          <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-600">{track.subtitle}</p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-700">
          {track.level}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-1.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div className={`h-full ${track.accent}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="w-8 text-right text-[10px] sm:text-xs font-semibold text-black">{pct}%</span>
      </div>

      <div className="mb-3 flex items-center gap-2 text-[9px] sm:text-[10px] text-gray-600">
        <span>
          {track.completed}/{track.lessons} lessons
        </span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span>{track.xp} XP</span>
        <span className="h-1 w-1 rounded-full bg-gray-300" />
        <span className="font-medium text-black">{track.reward}</span>
      </div>

      <button
        onClick={() => onStart?.(track)}
        disabled={locked}
        className={
          locked
            ? "mt-auto flex items-center justify-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-gray-400"
            : done
              ? "mt-auto flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
              : "mt-auto flex items-center justify-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
        }
      >
        {locked ? (
          <>
            <Lock className="h-3 w-3" /> Locked
          </>
        ) : done ? (
          <>
            <Check className="h-3 w-3" /> Claim reward
          </>
        ) : (
          <>
            <Play className="h-3 w-3" /> {track.completed > 0 ? "Continue" : "Start track"}
          </>
        )}
      </button>
    </div>
  )
}
