import { Settings } from "lucide-react"
import { skills } from "@/lib/learn-data"

export function SkillRadar() {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-semibold text-black">Skill map</h2>
        <button className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg hover:bg-gray-100">
          <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="sr-only">Skill map settings</span>
        </button>
      </div>

      <div className="relative mb-3 sm:mb-4 flex h-40 sm:h-52 items-center justify-center">
        <svg viewBox="0 0 300 300" className="h-full w-full" role="img" aria-label="Radar chart of Solana skill proficiency">
          <circle cx="150" cy="150" r="120" fill="none" stroke="#e5e5e5" strokeWidth="1" />
          <circle cx="150" cy="150" r="90" fill="none" stroke="#e5e5e5" strokeWidth="1" />
          <circle cx="150" cy="150" r="60" fill="none" stroke="#e5e5e5" strokeWidth="1" />
          <circle cx="150" cy="150" r="30" fill="none" stroke="#e5e5e5" strokeWidth="1" />

          <line x1="150" y1="30" x2="150" y2="270" stroke="#e5e5e5" strokeWidth="1" />
          <line x1="30" y1="150" x2="270" y2="150" stroke="#e5e5e5" strokeWidth="1" />
          <line x1="63" y1="63" x2="237" y2="237" stroke="#e5e5e5" strokeWidth="1" />
          <line x1="237" y1="63" x2="63" y2="237" stroke="#e5e5e5" strokeWidth="1" />
          <line x1="97" y1="47" x2="203" y2="253" stroke="#e5e5e5" strokeWidth="1" />
          <line x1="253" y1="97" x2="47" y2="203" stroke="#e5e5e5" strokeWidth="1" />
          <line x1="253" y1="203" x2="47" y2="97" stroke="#e5e5e5" strokeWidth="1" />

          <polygon
            points="150,52 227,105 196,190 150,214 84,192 74,110 150,52"
            fill="rgba(16, 185, 129, 0.15)"
            stroke="#10b981"
            strokeWidth="2"
          />

          <circle cx="150" cy="52" r="4" fill="#10b981" />
          <circle cx="227" cy="105" r="4" fill="#10b981" />
          <circle cx="196" cy="190" r="4" fill="#10b981" />
          <circle cx="150" cy="214" r="4" fill="#10b981" />
          <circle cx="84" cy="192" r="4" fill="#10b981" />
          <circle cx="74" cy="110" r="4" fill="#10b981" />

          <text x="150" y="20" textAnchor="middle" className="fill-black text-xs font-medium">1</text>
          <text x="250" y="100" textAnchor="start" className="fill-black text-xs font-medium">2</text>
          <text x="250" y="200" textAnchor="start" className="fill-black text-xs font-medium">3</text>
          <text x="150" y="290" textAnchor="middle" className="fill-black text-xs font-medium">4</text>
          <text x="50" y="235" textAnchor="end" className="fill-black text-xs font-medium">5</text>
          <text x="35" y="200" textAnchor="end" className="fill-black text-xs font-medium">6</text>
          <text x="35" y="100" textAnchor="end" className="fill-black text-xs font-medium">7</text>
        </svg>
      </div>

      <div className="space-y-2 sm:space-y-2.5">
        {skills.map((skill) => (
          <div key={skill.number} className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-3 text-[10px] sm:text-xs font-medium text-gray-600">{skill.number}</span>
            <span className="flex-1 text-[10px] sm:text-xs text-black">{skill.label}</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="h-1.5 w-10 sm:w-12 overflow-hidden rounded-full bg-gray-100">
                <div className={`h-full ${skill.color}`} style={{ width: skill.value }} />
              </div>
              <span className="w-7 sm:w-8 text-right text-[10px] sm:text-xs font-semibold text-black">{skill.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
