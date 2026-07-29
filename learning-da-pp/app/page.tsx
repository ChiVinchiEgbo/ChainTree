"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { AppHeader, type TabKey } from "@/components/learn/app-header"
import { SkillRadar } from "@/components/learn/skill-radar"
import { WalletPanel } from "@/components/learn/wallet-panel"
import { LessonViewer } from "@/components/learn/lesson-viewer"
import { LessonQuiz } from "@/components/learn/lesson-quiz"
import { TrackCard } from "@/components/learn/track-card"
import { BadgeGrid } from "@/components/learn/badge-grid"
import { LeaderboardTable } from "@/components/learn/leaderboard-table"
import { ActivityFeed } from "@/components/learn/activity-feed"
import { QuestList } from "@/components/learn/quest-list"
import { StatCard, RewardCard } from "@/components/learn/stat-card"
import { tracks } from "@/lib/learn-data"

export default function Page() {
  const [tab, setTab] = useState<TabKey>("dashboard")
  const [connected, setConnected] = useState(false)

  return (
    <div className="min-h-screen bg-[#c5c3d1] p-1 sm:p-3 md:p-4 lg:p-6 font-sans">
      <main className="mx-auto max-w-[1400px] rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#f5f4f0] p-3 sm:p-4 lg:p-6 shadow-2xl">
        <AppHeader active={tab} onChange={setTab} streak={18} />

        {tab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <SkillRadar />
              <RewardCard walletConnected={connected} onConnect={() => setConnected(true)} />
            </div>

            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <LessonViewer />
              <BadgeGrid />
            </div>

            <div className="lg:col-span-3 space-y-3 sm:space-y-4">
              <WalletPanel connected={connected} onConnect={() => setConnected(true)} onDisconnect={() => setConnected(false)} />
              <StatCard label="Total XP" value="12,760" tag="RANK #4" />
              <StatCard
                label="Track completion"
                value="46%"
                tag="ON TRACK"
                note={
                  <span className="flex items-start gap-1.5">
                    <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    Devnet rewards settle after 1 confirmation.
                  </span>
                }
              />
              <ActivityFeed />
            </div>
          </div>
        )}

        {tab === "learn" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <LessonViewer />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {tracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <LessonQuiz walletConnected={connected} />
              <SkillRadar />
            </div>
          </div>
        )}

        {tab === "quests" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <QuestList />
              <StatCard label="Streak" value="18" tag="DAYS" tagColor="bg-orange-500" />
            </div>
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <LessonQuiz walletConnected={connected} />
              <ActivityFeed />
            </div>
            <div className="lg:col-span-3 space-y-3 sm:space-y-4">
              <WalletPanel connected={connected} onConnect={() => setConnected(true)} onDisconnect={() => setConnected(false)} />
              <RewardCard walletConnected={connected} onConnect={() => setConnected(true)} />
            </div>
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <LeaderboardTable />
              <BadgeGrid columns={6} />
            </div>
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <StatCard label="Your rank" value="#4" tag="TOP 5%" />
              <StatCard label="Season pool" value="420 SOL" tag="14 DAYS LEFT" tagColor="bg-yellow-400" />
              <ActivityFeed />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
