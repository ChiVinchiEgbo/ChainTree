import { Copy, Lock } from "lucide-react"
import { badges, type Badge } from "@/lib/learn-data"

function BadgeIcon({ iconType }: { iconType: Badge["iconType"] }) {
  const shared = "h-4 w-4 sm:h-5 sm:w-5"
  if (iconType === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={shared}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7M12 7v10M16 13v4" />
      </svg>
    )
  }
  if (iconType === "list") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={shared}>
        <rect x="3" y="5" width="18" height="4" rx="1" />
        <rect x="3" y="11" width="18" height="4" rx="1" />
        <rect x="3" y="17" width="18" height="4" rx="1" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={shared}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6v8M9 10h6" />
    </svg>
  )
}

export function BadgeGrid({ columns = 3 }: { columns?: 3 | 6 }) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-black">Achievement NFTs</h2>
        <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
          <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="sr-only">Copy collection address</span>
        </button>
      </div>

      <div className={columns === 6 ? "grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-4" : "grid grid-cols-3 gap-2 sm:gap-4"}>
        {badges.map((badge) => {
          const pct = badge.status === "owned" ? 100 : badge.status === "claimable" ? 100 : 25
          const ring = badge.status === "owned" ? "#10b981" : badge.status === "claimable" ? "#f59e0b" : "#e5e5e5"

          return (
            <div key={badge.id} className="text-center">
              <div className="relative mx-auto mb-1.5 sm:mb-2 flex h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f3f3" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={ring}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 283} 283`}
                  />
                </svg>
                <span className={badge.status === "locked" ? "text-gray-300" : "text-black"}>
                  {badge.status === "locked" ? <Lock className="h-4 w-4 sm:h-5 sm:w-5" /> : <BadgeIcon iconType={badge.iconType} />}
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-medium leading-tight text-black">{badge.name}</div>
              <div className="text-[9px] leading-tight text-gray-500">{badge.detail}</div>
              {badge.status === "claimable" && (
                <button className="mt-1 rounded-full bg-black px-2 py-0.5 text-[9px] font-semibold text-white">Claim</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
