import { ArrowLeft, MapPin, User, Flag, Scale, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { Player } from "@/app/players/Player";
import { ConnectionManager } from "@/app/managers/ConnectionManager";
import { PlayerType } from "@/app/types/statsApp";
import PlayerStats from "./PlayerStats";

interface PlayerProfileProps {
  playerId: string;
  onBack: (teamId: number) => void;
}

export default function PlayerProfile({
  playerId,
  onBack,
}: PlayerProfileProps) {
  const [player, setPlayer] = useState<InstanceType<
    typeof Player<PlayerType>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerManager = ConnectionManager.getInstance();
        const playerData = await playerManager.getPlayer(playerId);
        if (playerData) {
          setPlayer(playerData);
        }
      } catch (error) {
        console.error("Error fetching player:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  if (loading || !player) {
    return <div>Loading player profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => onBack(player.getPlayerDBValues().teamId)}
        className="flex items-center mb-4 text-blue-500 hover:text-blue-600"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to {player.getPlayerDBValues().teamName}
      </button>
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <img
              src={player.getPlayerDBValues().photo || "/placeholder.svg"}
              alt={player.getPlayerDBValues().name}
              className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-grow">
              <h2 className="text-3xl font-bold mb-2">
                {player.getPlayerDBValues().firstName}{" "}
                {player.getPlayerDBValues().lastName}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Position</div>
                  <div className="text-lg font-semibold">
                    {player.getPlayerDBValues().position}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Nationality</div>
                  <div className="text-lg font-semibold">
                    {player.getPlayerDBValues().nationality}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Team</div>
                  <div className="text-lg font-semibold">
                    {player.getPlayerDBValues().teamName}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Height</div>
                  <div className="text-lg font-semibold">
                    {player.getPlayerDBValues().height}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="text-lg font-semibold">
                    {player.getPlayerDBValues().weight}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <PlayerStats player={player} />
      </div>
    </div>
  );
}
