"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TopBar from "@/components/TopBar"
import Sidebar from "@/components/Sidebar"
import TeamList from "@/components/TeamList"
import TeamProfile from "@/components/TeamProfile"
import PlayerProfile from "@/components/PlayerProfile"
import PlayerPool from "@/components/PlayerPool"
import AuthGuard from "@/components/AuthGuard"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"teams" | "playerPool">("teams")
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("sessionStart")
    router.push("/login")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
            currentPath="/dashboard"
            currentView={currentView}
            onChangeView={(view) => setCurrentView(view)}
          />
          <main className="flex-1 p-6">
            {currentView === "teams" && !selectedTeam && !selectedPlayer && (
              <TeamList onSelectTeam={(teamId) => setSelectedTeam(teamId)} />
            )}
            {currentView === "playerPool" && !selectedTeam && !selectedPlayer && (
              <PlayerPool onSelectPlayer={(playerId) => setSelectedPlayer(playerId)} />
            )}
            {selectedTeam && !selectedPlayer && (
              <TeamProfile
                teamId={selectedTeam}
                onBack={() => setSelectedTeam(null)}
                onSelectPlayer={(playerId) => setSelectedPlayer(playerId)}
              />
            )}
            {selectedPlayer && (
              <PlayerProfile
                playerId={selectedPlayer}
                onBack={(teamId) => {
                  setSelectedPlayer(null)
                  setSelectedTeam(teamId.toString())
                }}
              />
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

