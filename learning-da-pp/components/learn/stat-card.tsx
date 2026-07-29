import type { ReactNode } from "react"

export function StatCard({
  label,
  value,
  tag,
  tagColor = "bg-emerald-500",
  note,
}: {
  label: string
  value: string
  tag?: string
  tagColor?: string
  note?: ReactNode
}) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-1 text-[10px] sm:text-xs font-medium text-gray-600">{label}</div>
      <div className="mb-2 sm:mb-3 text-3xl sm:text-4xl font-bold text-black">{value}</div>
      {tag && (
        <div className={`inline-block rounded-full ${tagColor} px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white`}>
          {tag}
        </div>
      )}
      {note && <div className="mt-2 sm:mt-3 rounded-lg bg-gray-50 p-2 text-[9px] sm:text-[10px] leading-relaxed text-gray-700">{note}</div>}
    </div>
  )
}

export function RewardCard({ walletConnected, onConnect }: { walletConnected: boolean; onConnect: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 sm:p-6 text-white shadow-lg">
      <div className="relative z-10">
        <h3 className="mb-1 text-xl sm:text-2xl font-bold">Claim</h3>
        <p className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold opacity-90">0.25 SOL</p>
        <p className="mb-3 text-[10px] sm:text-xs leading-relaxed opacity-90">Solana 101 completion reward is unlocked.</p>
        <button
          onClick={walletConnected ? undefined : onConnect}
          className="rounded-full bg-white px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-emerald-700 transition-transform hover:scale-105"
        >
          {walletConnected ? "Claim now" : "Connect wallet"}
        </button>
      </div>
      <div className="absolute -right-4 sm:-right-8 bottom-4 sm:bottom-0">
        <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-20" aria-hidden="true">
          <circle cx="60" cy="60" r="50" fill="white" fillOpacity="0.3" />
          <circle cx="75" cy="45" r="35" fill="white" fillOpacity="0.2" />
          <circle cx="85" cy="60" r="25" fill="white" fillOpacity="0.25" />
        </svg>
      </div>
    </div>
  )
}
