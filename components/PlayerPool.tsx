"use client"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Player {
  id: string
  firstName: string
  lastName: string
  photo: string
  position: string
}

interface PlayerData {
  firstName: string
  lastName: string
  photo: string
  position: string
}

interface PlayersByPosition {
  Goalkeepers: Player[]
  Defenders: Player[]
  Midfielders: Player[]
  Forwards: Player[]
}

export default function PlayerPool() {
  const router = useRouter()
  const [playersByPosition, setPlayersByPosition] = useState<PlayersByPosition>({
    Goalkeepers: [],
    Defenders: [],
    Midfielders: [],
    Forwards: []
  })
  const [loading, setLoading] = useState(true)

  const groupPlayersByPosition = (players: Player[]) => {
    return {
      Goalkeepers: players.filter(p => p.position === "Goalkeeper"),
      Defenders: players.filter(p => p.position === "Defender"),
      Midfielders: players.filter(p => p.position === "Midfielder"),
      Forwards: players.filter(p => p.position === "Attacker")
    }
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const sessionData = sessionStorage.getItem("sessionStart")
        if (!sessionData) {
          console.log('No session data found')
          return
        }

        const { userId } = JSON.parse(sessionData)
        if (!userId) {
          console.log('No user ID found in session')
          return
        }

        const collectionName = `favorites_${userId}`
        const favoritesRef = collection(db, collectionName)
        const snapshot = await getDocs(query(favoritesRef))
        
        const playerPromises = snapshot.docs.map(async (favoriteDoc) => {
          const playerDoc = await getDoc(doc(db, 'players', favoriteDoc.id))
          if (playerDoc.exists()) {
            const data = playerDoc.data() as PlayerData
            return {
              id: playerDoc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              photo: data.photo,
              position: data.position
            } as Player
          }
          return null
        })

        const players = (await Promise.all(playerPromises)).filter((p): p is Player => p !== null)
        setPlayersByPosition(groupPlayersByPosition(players))
      } catch (error) {
        console.error('Error fetching favorites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) {
    return <div>Loading favorite players...</div>
  }

  const renderPositionSection = (title: string, players: Player[]) => {
    if (players.length === 0) return null

    return (
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="bg-blue-500 w-1 h-6 rounded-full mr-2"></span>
          {title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/players/${player.id}`)}
            >
              <img
                src={player.photo || "/placeholder.svg"}
                alt={`${player.firstName} ${player.lastName}`}
                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-sm font-semibold text-center text-gray-800">
                {player.firstName} {player.lastName}
              </h3>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalPlayers = Object.values(playersByPosition).reduce((sum, players) => sum + players.length, 0)

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center border-b pb-4">
        <User className="h-8 w-8 mr-3 text-blue-500" />
        Favorite Players
      </h2>
      
      {renderPositionSection("Goalkeepers", playersByPosition.Goalkeepers)}
      {renderPositionSection("Defenders", playersByPosition.Defenders)}
      {renderPositionSection("Midfielders", playersByPosition.Midfielders)}
      {renderPositionSection("Forwards", playersByPosition.Forwards)}

      {totalPlayers === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No favorite players yet
        </div>
      )}
    </div>
  )
}