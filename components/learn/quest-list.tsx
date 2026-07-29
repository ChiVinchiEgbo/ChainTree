"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"

type Quest = { id: string; title: string; detail: string; xp: number; done: boolean }

const initial: Quest[] = [
  { id: "q1", title: "Airdrop devnet SOL", detail: "solana airdrop 2", xp: 20, done: true },
  { id: "q2", title: "Send your first transfer", detail: "Move 0.01 SOL to a friend", xp: 40, done: true },
  { id: "q3", title: "Create an SPL mint", detail: "spl-token create-token", xp: 60, done: false },
  { id: "q4", title: "Derive a PDA", detail: "findProgramAddressSync with a seed", xp: 80, done: false },
  { id: "q5", title: "Deploy to devnet", detail: "anchor deploy --provider.cluster devnet", xp: 120, done: false },
]

export function QuestList() {
  const [quests, setQuests] = useState(initial)
  const earned = quests.filter((q) => q.done).reduce((sum, q) => sum + q.xp, 0)
  const total = quests.reduce((sum, q) => sum + q.xp, 0)

  const toggle = (id: string) => setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, done: !q.done } : q)))

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-black">Daily quests</h2>
        <span className="text-[10px] sm:text-xs font-semibold text-black">
          {earned}
          <span className="text-gray-500">/{total} XP</span>
        </span>
      </div>

      <div className="mb-3 flex h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(earned / total) * 100}%` }} />
      </div>

      <ul className="flex flex-col gap-1">
        {quests.map((quest) => (
          <li key={quest.id}>
            <button
              onClick={() => toggle(quest.id)}
              className="flex w-full items-center gap-2 rounded-lg px-1.5 py-2 text-left hover:bg-gray-50"
            >
              <span
                className={
                  quest.done
                    ? "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500"
                    : "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-gray-300"
                }
              >
                {quest.done && <Check className="h-2.5 w-2.5 text-white" />}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={
                    quest.done
                      ? "block truncate text-[10px] sm:text-xs font-medium text-gray-400 line-through"
                      : "block truncate text-[10px] sm:text-xs font-medium text-black"
                  }
                >
                  {quest.title}
                </span>
                <span className="block truncate font-mono text-[9px] text-gray-500">{quest.detail}</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-black">+{quest.xp}</span>
            </button>
          </li>
        ))}
      </ul>

      <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 py-2 text-[10px] sm:text-xs font-medium text-gray-500 hover:bg-gray-50">
        <Plus className="h-3.5 w-3.5" /> Add custom quest
      </button>
    </div>
  )
}
