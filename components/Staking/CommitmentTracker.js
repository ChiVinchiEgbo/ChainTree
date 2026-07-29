import React from 'react'
import { FiCheck, FiClock, FiExternalLink, FiAlertTriangle } from 'react-icons/fi'

export default function CommitmentTracker({ status, signature, error }) {
  if (!status && !error) return null

  const steps = [
    { key: 'processed', label: 'Processed', desc: 'Received by cluster leader' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Supermajority voted (66%+)' },
    { key: 'finalized', label: 'Finalized', desc: 'Rooted on-chain irreversibly' },
  ]

  const getStepState = (stepKey) => {
    if (error) return 'error'
    if (status === 'finalized') return 'completed'
    if (status === 'confirmed') {
      if (stepKey === 'processed' || stepKey === 'confirmed') return 'completed'
      return 'pending'
    }
    if (status === 'processed') {
      if (stepKey === 'processed') return 'completed'
      return 'pending'
    }
    return 'pending'
  }

  const solscanUrl = signature ? `https://solscan.io/tx/${signature}?cluster=devnet` : '#'

  return (
    <div className="mt-4 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiClock className="h-4 w-4 text-emerald-600" />
          <span className="text-xs sm:text-sm font-semibold text-black">Transaction Commitment Tracker</span>
        </div>
        {signature && (
          <a
            href={solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-black transition-colors hover:bg-gray-200"
          >
            Solscan Explorer
            <FiExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
          <FiAlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-semibold">Transaction Failed: </span>
            {error}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {steps.map((step) => {
            const state = getStepState(step.key)
            const isCurrent = status === step.key

            return (
              <div
                key={step.key}
                className={`rounded-lg p-2 sm:p-2.5 text-center transition-all ${
                  state === 'completed'
                    ? 'bg-emerald-50 border border-emerald-200'
                    : isCurrent
                    ? 'bg-amber-50 border border-amber-200 animate-pulse'
                    : 'bg-gray-50 border border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {state === 'completed' ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <FiCheck className="h-2.5 w-2.5" />
                    </span>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[9px] font-mono text-gray-700">
                      •
                    </span>
                  )}
                  <span className={`text-[10px] sm:text-xs font-bold ${state === 'completed' ? 'text-emerald-900' : 'text-gray-800'}`}>
                    {step.label}
                  </span>
                </div>
                <div className="text-[9px] text-gray-500 hidden sm:block">{step.desc}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
