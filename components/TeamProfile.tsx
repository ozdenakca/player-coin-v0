import { ArrowLeft, Calendar, Trophy } from "lucide-react"
import PlayerList from "./PlayerList"

interface TeamProfileProps {
  teamId: string
  onBack: () => void
  onSelectPlayer: (playerId: string) => void
}

const mockTeam = {
  id: "1",
  name: "Team A",
  logo: "/placeholder.svg",
  founded: "1990",
  trophies: 5,
  players: [
    { id: "1", name: "Player 1", position: "Forward", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "Player 2", position: "Midfielder", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Player 3", position: "Defender", avatar: "/placeholder.svg?height=40&width=40" },
  ],
}

export default function TeamProfile({ teamId, onBack, onSelectPlayer }: TeamProfileProps) {
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
              src={mockTeam.logo || "/placeholder.svg"}
              alt={mockTeam.name}
              className="w-24 h-24 rounded-full mr-4"
            />
            <div>
              <h2 className="text-3xl font-bold">{mockTeam.name}</h2>
              <div className="flex items-center mt-2">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600 mr-4">Founded in {mockTeam.founded}</span>
                <Trophy className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-600">{mockTeam.trophies} Trophies</span>
              </div>
            </div>
          </div>
        </div>
        <PlayerList players={mockTeam.players} onSelectPlayer={onSelectPlayer} />
      </div>
    </div>
  )
}

