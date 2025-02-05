import { ArrowLeft, Mail, MapPin, Calendar, User } from "lucide-react"
import PlayerStats from "./PlayerStats"

interface PlayerProfileProps {
  playerId: string
  onBack: () => void
}

const mockPlayer = {
  id: "1",
  name: "Player 1",
  position: "Forward",
  age: 25,
  height: "180cm",
  weight: "75kg",
  avatar: "/placeholder.svg?height=128&width=128",
  location: "New York, USA",
  email: "player1@example.com",
  stats: {
    goals: 15,
    assists: 10,
    appearances: 30,
  },
}

export default function PlayerProfile({ playerId, onBack }: PlayerProfileProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center mb-4 text-blue-500 hover:text-blue-600">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Team
      </button>
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <img
              src={mockPlayer.avatar || "/placeholder.svg"}
              alt={mockPlayer.name}
              className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-2">{mockPlayer.name}</h2>
              <p className="text-xl text-gray-600 mb-4">{mockPlayer.position}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-600">{mockPlayer.location}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-600">{mockPlayer.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-600">{mockPlayer.age} years old</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-600">
                    {mockPlayer.height}, {mockPlayer.weight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PlayerStats stats={mockPlayer.stats} />
      </div>
    </div>
  )
}

