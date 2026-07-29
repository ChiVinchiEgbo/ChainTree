import { Flame, Trophy } from "lucide-react"
import { leaderboard } from "@/lib/learn-data"

export function LeaderboardTable({ compact = false }: { compact?: boolean }) {
  const rows = compact ? leaderboard.slice(0, 5) : leaderboard

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-black">Leaderboard</h2>
        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-700">
          <Trophy className="h-3 w-3" /> Season 3
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 px-2 pb-1 text-[9px] font-medium uppercase tracking-wide text-gray-500">
          <span className="w-4">#</span>
          <span className="flex-1">Learner</span>
          {!compact && <span className="w-14 text-right">Streak</span>}
          <span className="w-16 text-right">XP</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.handle}
            className={
              row.you
                ? "flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-2 ring-1 ring-emerald-500"
                : "flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-gray-50"
            }
          >
            <span
              className={
                row.rank <= 3
                  ? "flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white"
                  : "w-4 text-center text-[10px] font-medium text-gray-500"
              }
            >
              {row.rank}
            </span>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
              <div className="min-w-0">
                <div className="truncate text-[10px] sm:text-xs font-medium text-black">{row.handle}</div>
                <div className="truncate font-mono text-[9px] text-gray-500">{row.wallet}</div>
              </div>
            </div>
            {!compact && (
              <span className="flex w-14 items-center justify-end gap-1 text-[10px] sm:text-xs text-gray-700">
                <Flame className="h-3 w-3 text-orange-500" />
                {row.streak}
              </span>
            )}
            <span className="w-16 text-right text-[10px] sm:text-xs font-semibold text-black">
              {row.xp.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
