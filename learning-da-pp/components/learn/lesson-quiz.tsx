"use client"

import { useState } from "react"
import { Check, X, ArrowRight, RotateCcw, Sparkles } from "lucide-react"
import { quiz } from "@/lib/learn-data"

export function LessonQuiz({ walletConnected }: { walletConnected: boolean }) {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = quiz[step]
  const answered = picked !== null

  const pick = (index: number) => {
    if (answered) return
    setPicked(index)
    if (index === question.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (step === quiz.length - 1) {
      setFinished(true)
      return
    }
    setStep((s) => s + 1)
    setPicked(null)
  }

  const restart = () => {
    setStep(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-black">Checkpoint quiz</h2>
          <p className="text-[9px] sm:text-[10px] text-gray-600">Anchor Programs · Lesson 5</p>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-gray-700">
          {finished ? quiz.length : step + 1}/{quiz.length}
        </span>
      </div>

      <div className="mb-3 flex h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${((finished ? quiz.length : step) / quiz.length) * 100}%` }}
        />
      </div>

      {finished ? (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="mb-1 text-xl sm:text-2xl font-bold text-black">
            {score}/{quiz.length}
          </div>
          <p className="mb-3 text-[10px] sm:text-xs leading-relaxed text-gray-600">
            {score === quiz.length
              ? "Perfect run. Reward is ready to mint to your wallet."
              : "Nice work. Score 3/3 to unlock the on-chain reward."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={!walletConnected || score < quiz.length}
              className={
                walletConnected && score === quiz.length
                  ? "rounded-full bg-black px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-white transition-transform hover:scale-105"
                  : "rounded-full bg-gray-200 px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-gray-400"
              }
            >
              {walletConnected ? "Mint +60 XP" : "Connect wallet"}
            </button>
            <button
              onClick={restart}
              className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-black hover:bg-gray-50"
            >
              <RotateCcw className="h-3 w-3" /> Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs sm:text-sm font-medium leading-relaxed text-black">{question.prompt}</p>

          <div className="mb-3 flex flex-col gap-1.5">
            {question.options.map((option, index) => {
              const isAnswer = index === question.answer
              const isPicked = index === picked
              const base =
                "flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left text-[10px] sm:text-xs transition-colors"
              const state = !answered
                ? "border-gray-200 text-black hover:border-gray-400 hover:bg-gray-50"
                : isAnswer
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                  : isPicked
                    ? "border-orange-500 bg-orange-50 text-orange-900"
                    : "border-gray-200 text-gray-400"

              return (
                <button key={option} onClick={() => pick(index)} className={`${base} ${state}`}>
                  <span className="leading-relaxed">{option}</span>
                  {answered && isAnswer && <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />}
                  {answered && isPicked && !isAnswer && <X className="h-3.5 w-3.5 flex-shrink-0 text-orange-600" />}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className="mb-3 rounded-lg bg-gray-50 p-2.5 text-[9px] sm:text-[10px] leading-relaxed text-gray-700">
              {question.explain}
            </div>
          )}

          <button
            onClick={next}
            disabled={!answered}
            className={
              answered
                ? "flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-3 py-2 text-[10px] sm:text-xs font-semibold text-white transition-transform hover:scale-[1.01]"
                : "flex w-full items-center justify-center gap-1.5 rounded-full bg-gray-100 px-3 py-2 text-[10px] sm:text-xs font-semibold text-gray-400"
            }
          >
            {step === quiz.length - 1 ? "See results" : "Next question"} <ArrowRight className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  )
}
