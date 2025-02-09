"use client";

import { Player } from "@/app/players/Player";
import { PlayerType } from "@/app/types/statsApp";

interface PlayerStatsProps {
  player: InstanceType<typeof Player<PlayerType>>;
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const playerValues = player.getPlayerValues();
  const playerDBValues = player.getPlayerDBValues();

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Metric</th>
                <th className="text-right py-2 px-4">Value</th>
                <th className="text-right py-2 px-4">League Average</th>
                <th className="text-right py-2 px-4">Weight</th>
                <th className="text-right py-2 px-4">Normalized Value</th>
                <th className="text-right py-2 px-4">Normalized × Weight</th>
              </tr>
            </thead>
            <tbody>
              {playerValues.performanceStats &&
                Object.entries(playerValues.performanceStats.stats).map(
                  ([key, stat]) => (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-600">{key}</td>
                      <td className="py-2 px-4 text-right">
                        {stat.value.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {stat.leaugeAvarage.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">{stat.weight}</td>
                      <td className="py-2 px-4 text-right">
                        {(stat.value / stat.leaugeAvarage).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {(
                          (stat.value / stat.leaugeAvarage) *
                          stat.weight
                        ).toFixed(2)}
                      </td>
                    </tr>
                  )
                )}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-4">Final Score</td>
                <td className="py-2 px-4 text-right" colSpan={5}>
                  {playerValues.performanceStats?.finalValue.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Impact */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Team Impact</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Metric</th>
                <th className="text-right py-2 px-4">Player Total</th>
                <th className="text-right py-2 px-4">Team Total</th>
                <th className="text-right py-2 px-4">Impact %</th>
              </tr>
            </thead>
            <tbody>
              {playerValues.impactOnTeam &&
                Object.entries(playerValues.impactOnTeam.stats).map(
                  ([key, stat]) => (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-600">{key}</td>
                      <td className="py-2 px-4 text-right">
                        {stat.playerTotal}
                      </td>
                      <td className="py-2 px-4 text-right">{stat.teamTotal}</td>
                      <td className="py-2 px-4 text-right">
                        {stat.impactPercentage.toFixed(1)}%
                      </td>
                    </tr>
                  )
                )}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-4">Overall Impact</td>
                <td className="py-2 px-4 text-right" colSpan={3}>
                  {playerValues.impactOnTeam?.finalValue.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Raw Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Appearances</td>
                <td className="py-2 px-4 text-right">
                  {playerDBValues.statistics[0]?.games.appearences}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Minutes</td>
                <td className="py-2 px-4 text-right">
                  {playerDBValues.statistics[0]?.games.minutes}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-gray-600">Rating</td>
                <td className="py-2 px-4 text-right">
                  {playerDBValues.statistics[0]?.games.rating || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
