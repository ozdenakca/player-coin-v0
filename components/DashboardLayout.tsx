"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import TopBar from "@/components/TopBar"
import Sidebar from "@/components/Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

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
          currentView="teams"
          onChangeView={() => {}}
        />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 