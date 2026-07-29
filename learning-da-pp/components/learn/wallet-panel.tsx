"use client"

import { useState } from "react"
import { Wallet, Copy, Check, ExternalLink, Power } from "lucide-react"

export function WalletPanel({
  connected,
  onConnect,
  onDisconnect,
}: {
  connected: boolean
  onConnect: () => void
  onDisconnect: () => void
}) {
  const [copied, setCopied] = useState(false)
  const address = "5Hb9kQx2vNpRw8TzLm3sQeYd7Fb1nUaKcJv4c"
  const short = `${address.slice(0, 4)}…${address.slice(-4)}`

  const copy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!connected) {
    return (
      <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-5 text-center shadow-sm">
        <div className="mx-auto mb-2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-50">
          <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <h2 className="mb-1 text-sm sm:text-base font-semibold text-black">Connect wallet</h2>
        <p className="mb-3 text-[10px] sm:text-xs leading-relaxed text-gray-600">
          Link a Solana wallet on devnet to earn XP and claim on-chain rewards.
        </p>
        <button
          onClick={onConnect}
          className="rounded-full bg-black px-4 py-2 text-[10px] sm:text-xs font-semibold text-white transition-transform hover:scale-105"
        >
          Connect
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-black">Wallet</h2>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            DEVNET
          </span>
          <button onClick={onDisconnect} className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
            <Power className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="sr-only">Disconnect wallet</span>
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-2">
        <span className="font-mono text-[10px] sm:text-xs text-black">{short}</span>
        <div className="flex items-center gap-1">
          <button onClick={copy} className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white">
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span className="sr-only">Copy address</span>
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white">
            <ExternalLink className="h-3 w-3" />
            <span className="sr-only">View on explorer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-gray-50 p-2.5">
          <div className="mb-0.5 text-[9px] sm:text-[10px] text-gray-600">SOL balance</div>
          <div className="text-lg sm:text-xl font-bold text-black">4.812</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2.5">
          <div className="mb-0.5 text-[9px] sm:text-[10px] text-gray-600">LEARN token</div>
          <div className="text-lg sm:text-xl font-bold text-black">1,240</div>
        </div>
      </div>
    </div>
  )
}
