"use client"
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"

interface Team {
  id: string
  name: string
  logo: string
}

interface TeamListProps {}

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamsQuery = query(collection(db, 'teams'))
        const querySnapshot = await getDocs(teamsQuery)
        const teamsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Team))
        setTeams(teamsData)
      } catch (error) {
        console.error('Error fetching teams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (loading) {
    return <div>Loading teams...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/teams/${team.id}`)}
          >
            <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-24 h-24 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-center">{team.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

