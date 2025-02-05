import { ArrowLeft, Calendar, Trophy } from "lucide-react"
import PlayerList from "./PlayerList"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"

interface TeamProfileProps {
  teamId: string
  onBack: () => void
  onSelectPlayer: (playerId: string) => void
}

interface Team {
  id: string
  name: string
  logo: string
  founded: string
  country: string
  venue: {
    capacity: number
    city: string
    address: string
  }
}

interface Player {
  id: string
  name: string
  firstName: string
  lastName: string
  position: string
  photo: string
  nationality: string
  teamId: string
}

export default function TeamProfile({ teamId, onBack, onSelectPlayer }: TeamProfileProps) {
  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamAndPlayers = async () => {
      try {
        console.log('Fetching team with ID:', teamId)
        
        // Fetch team data
        const teamRef = doc(db, 'teams', teamId.toString())
        const teamSnap = await getDoc(teamRef)
        
        console.log('Team data:', teamSnap.data())
        
        if (teamSnap.exists()) {
          setTeam({ id: teamSnap.id, ...teamSnap.data() } as Team)
        }

        // Fetch players for this team
        const playersQuery = query(
          collection(db, 'players'),
          where('teamId', '==', parseInt(teamId))
        )
        const playersSnapshot = await getDocs(playersQuery)
        const playersData = playersSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName} ${data.lastName}`,
            position: data.position,
            photo: data.photo,
            nationality: data.nationality,
            teamId: data.teamId
          } as Player
        })
        
        console.log('Players data:', playersData)
        setPlayers(playersData)
      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchTeamAndPlayers()
    }
  }, [teamId])

  if (loading || !team) {
    return <div>Loading team profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center mb-4 text-blue-500 hover:text-blue-600">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Teams
      </button>
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <img
              src={team.logo || "/placeholder.svg"}
              alt={team.name}
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <h2 className="text-3xl font-bold">{team.name}</h2>
              <div className="flex items-center mt-2">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600 mr-4">Founded in {team.founded}</span>
                <Trophy className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600">{team.country}</span>
              </div>
            </div>
          </div>
        </div>
        <PlayerList players={players} onSelectPlayer={onSelectPlayer} />
      </div>
    </div>
  )
}

