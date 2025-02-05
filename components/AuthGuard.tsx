"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const sessionStart = sessionStorage.getItem("sessionStart")
    if (!sessionStart) {
      router.replace('/login')
    }
  }, [router])

  return <>{children}</>
} 