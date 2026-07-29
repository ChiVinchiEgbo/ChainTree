"use client"

import { Search, HelpCircle, Flame } from "lucide-react"

export type TabKey = "dashboard" | "learn" | "quests" | "leaderboard"

const tabs: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "learn", label: "Learn" },
  { key: "quests", label: "Quests" },
  { key: "leaderboard", label: "Leaderboard" },
]

export function AppHeader({
  active,
  onChange,
  streak,
}: {
  active: TabKey
  onChange: (tab: TabKey) => void
  streak: number
}) {
  return (
    <header className="mb-3 sm:mb-4 lg:mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-[10px] font-bold text-white">S</span>
        <span className="text-sm sm:text-base font-semibold text-black">SolAcademy</span>
      </div>

      <nav className="flex items-center gap-0.5 sm:gap-1 flex-wrap" aria-label="Primary">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            aria-current={active === tab.key ? "page" : undefined}
            className={
              active === tab.key
                ? "rounded-full bg-black px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-white"
                : "rounded-full px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-black transition-colors hover:bg-gray-200"
            }
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1 rounded-full bg-orange-500 px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white">
          <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {streak}
          <span className="sr-only">day learning streak</span>
        </div>
        <button className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-gray-200">
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="sr-only">Search lessons</span>
        </button>
        <button className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-gray-200">
          <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="sr-only">Help</span>
        </button>
        <div className="h-7 w-7 sm:h-9 sm:w-9 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
      </div>
    </header>
  )
}
