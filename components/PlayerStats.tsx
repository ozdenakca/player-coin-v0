import { Activity } from "lucide-react"

interface StatsProps {
  stats: {
    cards: {
      red: number | null;
      yellow: number | null;
    }
  }
}

export default function PlayerStats({ stats }: StatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Cards</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Red Cards</div>
          <div className="text-xl font-semibold">{stats?.cards?.red ?? 0}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Yellow Cards</div>
          <div className="text-xl font-semibold">{stats?.cards?.yellow ?? 0}</div>
        </div>
      </div>
    </div>
  )
}

