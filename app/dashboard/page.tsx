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
import DashboardLayout from "@/components/DashboardLayout"

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
    <DashboardLayout>
      <TeamList />
    </DashboardLayout>
  )
}

