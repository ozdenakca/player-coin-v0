import { User } from "lucide-react"

interface Player {
  id: string
  name: string
  position: string
  avatar: string
}

interface PlayerPoolProps {
  onSelectPlayer: (playerId: string) => void
}

const mockPlayers: Player[] = [
  { id: "1", name: "John Doe", position: "Forward", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "2", name: "Jane Smith", position: "Midfielder", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "3", name: "Mike Johnson", position: "Defender", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "4", name: "Sarah Williams", position: "Goalkeeper", avatar: "/placeholder.svg?height=40&width=40" },
]

export default function PlayerPool({ onSelectPlayer }: PlayerPoolProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <User className="mr-2" />
        Player Pool
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectPlayer(player.id)}
          >
            <img
              src={player.avatar || "/placeholder.svg"}
              alt={player.name}
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold text-center">{player.name}</h3>
            <p className="text-gray-600 text-center">{player.position}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

