import { Users } from "lucide-react"

interface Player {
  id: string
  name: string
  position: string
  photo: string
}

interface PlayerListProps {
  players: Player[]
  onSelectPlayer: (playerId: string) => void
}

export default function PlayerList({ players, onSelectPlayer }: PlayerListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Users className="h-6 w-6 mr-2" />
        Players
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSelectPlayer(player.id)}
          >
            <img src={player.photo || "/placeholder.svg"} alt={player.name} className="w-12 h-12 rounded-full mr-3" />
            <div>
              <h4 className="font-semibold">{player.name}</h4>
              <p className="text-sm text-gray-600">{player.position}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

