import { ArrowUpRight, Coins, Image as ImageIcon, CircleCheck, Landmark } from "lucide-react"
import { activity, type Activity } from "@/lib/learn-data"

const icons: Record<Activity["kind"], typeof Coins> = {
  reward: Coins,
  mint: ImageIcon,
  quiz: CircleCheck,
  stake: Landmark,
}

export function ActivityFeed() {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-black">On-chain activity</h2>
        <span className="text-[9px] sm:text-[10px] text-gray-500">last 24h</span>
      </div>

      <div className="flex flex-col gap-1">
        {activity.map((item) => {
          const Icon = icons[item.kind]
          const negative = item.amount.startsWith("-")

          return (
            <div key={item.id} className="flex items-center gap-2 rounded-lg px-1.5 py-2 hover:bg-gray-50">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50">
                <Icon className="h-3.5 w-3.5 text-black" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[10px] sm:text-xs font-medium text-black">{item.label}</div>
                <div className="truncate text-[9px] text-gray-500">{item.detail}</div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={
                    negative
                      ? "text-[10px] sm:text-xs font-semibold text-orange-600"
                      : "text-[10px] sm:text-xs font-semibold text-emerald-600"
                  }
                >
                  {item.amount}
                </span>
                <span className="flex items-center gap-0.5 font-mono text-[9px] text-gray-400">
                  {item.signature}
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
