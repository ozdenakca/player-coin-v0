"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"

interface SessionContextType {
  isLoggedIn: boolean
  login: (userId: string) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
      const sessionData = sessionStorage.getItem("sessionStart")
      if (sessionData) {
        try {
          const { timestamp, userId } = JSON.parse(sessionData)
          const currentTime = Date.now()
          const twoHours = 2 * 60 * 60 * 1000

          if (currentTime - timestamp < twoHours && userId) {
            setIsLoggedIn(true)
          } else {
            sessionStorage.removeItem("sessionStart")
            setIsLoggedIn(false)
            router.push("/login")
          }
        } catch (e) {
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
    const interval = setInterval(checkSession, 60000)

    return () => clearInterval(interval)
  }, [router])

  const login = (userId: string) => {
    const sessionData = {
      timestamp: Date.now(),
      userId: userId
    }
    sessionStorage.setItem("sessionStart", JSON.stringify(sessionData))
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

