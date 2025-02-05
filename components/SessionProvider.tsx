"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface SessionContextType {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const sessionStart = sessionStorage.getItem("sessionStart")
      if (sessionStart) {
        const sessionStartTime = Number.parseInt(sessionStart, 10)
        const currentTime = Date.now()
        const twoHours = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

        if (currentTime - sessionStartTime < twoHours) {
          setIsLoggedIn(true)
        } else {
          sessionStorage.removeItem("sessionStart")
          setIsLoggedIn(false)
          router.push("/login")
        }
      } else {
        setIsLoggedIn(false)
        router.push("/login")
      }
    }

    checkSession()
    const interval = setInterval(checkSession, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [router])

  const login = () => {
    sessionStorage.setItem("sessionStart", Date.now().toString())
    setIsLoggedIn(true)
  }

  const logout = () => {
    sessionStorage.removeItem("sessionStart")
    setIsLoggedIn(false)
    router.push("/login")
  }

  return <SessionContext.Provider value={{ isLoggedIn, login, logout }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

