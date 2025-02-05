"use client"

import { User, Loader2 } from "lucide-react"
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
    Forwards: [],
  })
  const [loading, setLoading] = useState(true)

  const groupPlayersByPosition = (players: Player[]) => {
    return {
      Goalkeepers: players.filter((p) => p.position === "Goalkeeper"),
      Defenders: players.filter((p) => p.position === "Defender"),
      Midfielders: players.filter((p) => p.position === "Midfielder"),
      Forwards: players.filter((p) => p.position === "Attacker"),
    }
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const sessionData = sessionStorage.getItem("sessionStart")
        if (!sessionData) {
          console.log("No session data found")
          return
        }

        const { userId } = JSON.parse(sessionData)
        if (!userId) {
          console.log("No user ID found in session")
          return
        }

        const collectionName = `favorites_${userId}`
        const favoritesRef = collection(db, collectionName)
        const snapshot = await getDocs(query(favoritesRef))

        const playerPromises = snapshot.docs.map(async (favoriteDoc) => {
          const playerDoc = await getDoc(doc(db, "players", favoriteDoc.id))
          if (playerDoc.exists()) {
            const data = playerDoc.data() as PlayerData
            return {
              id: playerDoc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              photo: data.photo,
              position: data.position,
            } as Player
          }
          return null
        })

        const players = (await Promise.all(playerPromises)).filter((p): p is Player => p !== null)
        setPlayersByPosition(groupPlayersByPosition(players))
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [groupPlayersByPosition]) // Added groupPlayersByPosition to dependencies

  const renderPositionSection = (title: string, players: Player[]) => {
    if (players.length === 0) return null

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <span className="bg-blue-500 w-1 h-6 rounded-full mr-2"></span>
          {title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105 duration-200"
              onClick={() => router.push(`/players/${player.id}`)}
            >
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img
                  src={player.photo || "/placeholder.svg"}
                  alt={`${player.firstName} ${player.lastName}`}
                  className="w-full h-full rounded-full object-cover border-2 border-blue-500"
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {player.position[0]}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-center text-gray-800 line-clamp-2">
                {player.firstName} {player.lastName}
              </h3>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalPlayers = Object.values(playersByPosition).reduce((sum, players) => sum + players.length, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg font-semibold text-gray-700">Loading favorite players...</span>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-md">
      <h2 className="text-3xl font-bold mb-8 flex items-center border-b border-gray-300 pb-4 text-gray-800">
        <User className="h-8 w-8 mr-3 text-blue-500" />
        Favorite Players
      </h2>

      {renderPositionSection("Goalkeepers", playersByPosition.Goalkeepers)}
      {renderPositionSection("Defenders", playersByPosition.Defenders)}
      {renderPositionSection("Midfielders", playersByPosition.Midfielders)}
      {renderPositionSection("Forwards", playersByPosition.Forwards)}

      {totalPlayers === 0 && (
        <div className="text-center text-gray-500 mt-8 p-8 bg-white rounded-lg shadow-inner">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold">No favorite players yet</p>
          <p className="mt-2">Start adding players to your favorites to see them here!</p>
        </div>
      )}
    </div>
  )
}

