"use client"
import { useParams } from "next/navigation"
import PlayerProfile from "@/components/PlayerProfile"
import DashboardLayout from "@/components/DashboardLayout"

export default function PlayerPage() {
  const params = useParams()
  const playerId = params.playerId as string

  return (
    <DashboardLayout>
      <PlayerProfile 
        playerId={playerId}
        onBack={(teamId) => window.location.href = `/teams/${teamId}`}
      />
    </DashboardLayout>
  )
} 