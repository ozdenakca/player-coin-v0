"use client"
import { useParams } from "next/navigation"
import TeamProfile from "@/components/TeamProfile"
import DashboardLayout from "@/components/DashboardLayout"

export default function TeamPage() {
  const params = useParams()
  const teamId = params.teamId as string

  return (
    <DashboardLayout>
      <TeamProfile 
        teamId={teamId}
        onBack={() => window.location.href = '/dashboard'}
        onSelectPlayer={(playerId) => window.location.href = `/players/${playerId}`}
      />
    </DashboardLayout>
  )
} 