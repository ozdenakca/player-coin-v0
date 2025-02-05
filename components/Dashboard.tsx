"use client"

import { useState } from "react"
import TopBar from "./TopBar"
import Sidebar from "./Sidebar"
import TeamProfile from "./TeamProfile"
import PlayerProfile from "./PlayerProfile"
import { useSession } from "./SessionProvider"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const { logout } = useSession()

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={logout} />
        <main className="flex-1 p-6">
          {!selectedTeam && !selectedPlayer && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Welcome to Player Coin Dashboard</h1>
              <p>Select a team to view details.</p>
            </div>
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

