import { Activity } from "lucide-react"

interface PlayerStatsProps {
  stats: {
    goals: number
    assists: number
    appearances: number
  }
}

export default function PlayerStats({ stats }: PlayerStatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Activity className="h-6 w-6 mr-2" />
        Player Stats
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold mb-1">{stats.goals}</p>
          <p className="text-sm text-gray-600">Goals</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold mb-1">{stats.assists}</p>
          <p className="text-sm text-gray-600">Assists</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-3xl font-bold mb-1">{stats.appearances}</p>
          <p className="text-sm text-gray-600">Appearances</p>
        </div>
      </div>
    </div>
  )
}

