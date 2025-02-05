"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Clear any existing session
    sessionStorage.removeItem("sessionStart")
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  return null
}

