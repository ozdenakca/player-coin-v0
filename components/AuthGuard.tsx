"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { checkAuth } from "@/lib/utils"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user || !checkAuth()) {
        sessionStorage.removeItem("sessionStart")
        router.push("/login")
      } else {
        setIsAuthorized(true)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!isAuthorized) {
    return null // or a loading spinner
  }

  return <>{children}</>
} 