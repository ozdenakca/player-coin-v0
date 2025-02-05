"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TopBar from "@/components/TopBar"
import Sidebar from "@/components/Sidebar"
import TeamList from "@/components/TeamList"
import TeamProfile from "@/components/TeamProfile"
import PlayerProfile from "@/components/PlayerProfile"
import PlayerPool from "@/components/PlayerPool"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"teams" | "playerPool">("teams")
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const sessionStart = sessionStorage.getItem("sessionStart")
      if (sessionStart) {
        const sessionStartTime = Number.parseInt(sessionStart, 10)
        const currentTime = Date.now()
        const twoHours = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

        if (currentTime - sessionStartTime >= twoHours) {
          sessionStorage.removeItem("sessionStart")
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 60000)
    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("sessionStart")
    router.push("/login")
  }

  return (
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
              onBack={() => {
                setSelectedPlayer(null)
                setSelectedTeam(null)
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

