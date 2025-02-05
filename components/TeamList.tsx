interface TeamListProps {
  onSelectTeam: (teamId: string) => void
}

const mockTeams = [
  { id: "1", name: "Team A", logo: "/placeholder.svg" },
  { id: "2", name: "Team B", logo: "/placeholder.svg" },
  { id: "3", name: "Team C", logo: "/placeholder.svg" },
  { id: "4", name: "Team D", logo: "/placeholder.svg" },
]

export default function TeamList({ onSelectTeam }: TeamListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Teams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectTeam(team.id)}
          >
            <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-24 h-24 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-center">{team.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

