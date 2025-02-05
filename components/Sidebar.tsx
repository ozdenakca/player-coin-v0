"use client"

import { Home, Users, LogOut, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  currentPath: string
  currentView: "teams" | "playerPool"
  onChangeView: (view: "teams" | "playerPool") => void
}

export default function Sidebar({ isOpen, onClose, onLogout, currentPath, currentView, onChangeView }: SidebarProps) {
  const router = useRouter()

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="p-4">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6" />
        </button>
        <nav className="mt-8">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => {
                  onChangeView("teams")
                  onClose()
                }}
                className={`flex items-center w-full text-left ${
                  currentView === "teams" ? "text-blue-500" : "text-gray-700 hover:text-blue-500"
                }`}
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onChangeView("playerPool")
                  onClose()
                }}
                className={`flex items-center w-full text-left ${
                  currentView === "playerPool" ? "text-blue-500" : "text-gray-700 hover:text-blue-500"
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Player Pool
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onClose()
                  onLogout()
                }}
                className="flex items-center w-full text-left text-gray-700 hover:text-blue-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

