"use client"

import { useState } from "react"
import { Maximize2, List, Play, Terminal } from "lucide-react"

const views = ["Lesson", "Code", "Terminal"] as const

const snippet = `use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod counter {
    use super::*;

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        Ok(())
    }
}`

export function LessonViewer() {
  const [view, setView] = useState<(typeof views)[number]>("Lesson")

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 sm:mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-black">Current lesson</h2>
            <p className="text-[9px] sm:text-[10px] text-gray-600">Anchor Programs · Building a counter program</p>
          </div>
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">
            <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="sr-only">Expand lesson</span>
          </button>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {views.map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={
                view === item
                  ? "rounded-full bg-black px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-medium text-white"
                  : "rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-medium text-gray-600 hover:bg-gray-100"
              }
            >
              {item}
            </button>
          ))}
          <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">
            <List className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="sr-only">Lesson outline</span>
          </button>
        </div>
      </div>

      <div className="relative h-[280px] sm:h-[350px] overflow-hidden rounded-lg sm:rounded-xl bg-gray-50">
        {view === "Lesson" && (
          <div className="h-full overflow-auto p-4 sm:p-5">
            <span className="mb-2 inline-block rounded-full bg-black px-2 py-0.5 text-[9px] font-medium text-white">
              Step 3 of 7
            </span>
            <h3 className="mb-2 text-sm sm:text-base font-semibold text-black text-balance">
              Accounts are passed in, never fetched
            </h3>
            <p className="mb-3 text-[10px] sm:text-xs leading-relaxed text-gray-700">
              A Solana program cannot read arbitrary state. Every account a transaction touches must be declared up front,
              which is what makes parallel execution possible. In Anchor you declare them with the{" "}
              <code className="rounded bg-white px-1 py-0.5 font-mono text-[9px]">#[derive(Accounts)]</code> macro.
            </p>
            <ul className="mb-4 flex flex-col gap-1.5 text-[10px] sm:text-xs leading-relaxed text-gray-700">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                Mark an account <span className="font-medium text-black">mut</span> when its data or lamports change.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                Add constraints so the runtime rejects bad inputs before your logic runs.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                Signer checks are the single most common audit finding.
              </li>
            </ul>
            <button className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-[10px] sm:text-xs font-semibold text-white transition-transform hover:scale-105">
              <Play className="h-3 w-3" /> Continue lesson
            </button>
          </div>
        )}

        {view === "Code" && (
          <pre className="h-full overflow-auto bg-[#1a1a1a] p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] leading-relaxed text-emerald-300">
            <code>{snippet}</code>
          </pre>
        )}

        {view === "Terminal" && (
          <div className="h-full overflow-auto bg-[#1a1a1a] p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] leading-relaxed">
            <div className="mb-2 flex items-center gap-1.5 text-gray-400">
              <Terminal className="h-3 w-3" /> devnet
            </div>
            <p className="text-gray-300">$ anchor build</p>
            <p className="text-gray-500">Compiling counter v0.1.0</p>
            <p className="text-gray-500">Finished release [optimized] target(s) in 21.4s</p>
            <p className="mt-2 text-gray-300">$ anchor deploy --provider.cluster devnet</p>
            <p className="text-gray-500">Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS</p>
            <p className="mt-2 text-emerald-400">Deploy success</p>
            <p className="mt-2 text-gray-300">
              $ <span className="animate-pulse">_</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
