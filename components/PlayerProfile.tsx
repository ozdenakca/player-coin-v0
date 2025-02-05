import { ArrowLeft, MapPin, User, Flag, Scale, Ruler } from "lucide-react"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import PlayerStats from "./PlayerStats"

interface PlayerProfileProps {
  playerId: string
  onBack: (teamId: number) => void
}

interface Statistics {
  cards: {
    red: number | null
    yellow: number | null
  }
}

interface Player {
  id: string
  firstName: string
  lastName: string
  name: string
  position: string
  photo: string
  nationality: string
  height: string  // "173 cm"
  weight: string  // "70 kg"
  teamId: number
  teamName: string
  statistics: Statistics
  updatedAt: string
}

export default function PlayerProfile({ playerId, onBack }: PlayerProfileProps) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerDoc = await getDoc(doc(db, 'players', playerId))
        if (playerDoc.exists()) {
          const data = playerDoc.data()
          setPlayer({
            id: playerDoc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName} ${data.lastName}`,
            position: data.position,
            photo: data.photo,
            nationality: data.nationality,
            height: data.height,  // "173 cm"
            weight: data.weight,  // "70 kg"
            teamId: data.teamId,
            teamName: data.teamName,
            statistics: data.statistics,
            updatedAt: data.updatedAt
          } as Player)
        }
      } catch (error) {
        console.error('Error fetching player:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayer()
  }, [playerId])

  if (loading || !player) {
    return <div>Loading player profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => onBack(player.teamId)} 
        className="flex items-center mb-4 text-blue-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to {player.teamName}
      </button>
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <img
              src={player.photo || "/placeholder.svg"}
              alt={player.name}
              className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-2">{player.firstName} {player.lastName}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Position</div>
                  <div className="text-lg font-semibold">{player.position}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Nationality</div>
                  <div className="text-lg font-semibold">{player.nationality}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Team</div>
                  <div className="text-lg font-semibold">{player.teamName}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Height</div>
                  <div className="text-lg font-semibold">{player.height}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="text-lg font-semibold">{player.weight}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Statistics Section */}
        <PlayerStats stats={player.statistics} />

      </div>
    </div>
  )
}

