"use client";

import { Player } from "@/app/players/Player";
import { PlayerType } from "@/app/types/statsApp";
import { WeightsManager } from "@/app/managers/WeightManager";
import { useState } from "react";
import { PlayerWeights } from "@/app/types/statsDB";

interface PlayerStatsProps {
  player: InstanceType<typeof Player<PlayerType>>;
}

export default function PlayerStats({ player }: PlayerStatsProps) {
  const playerValues = player.getPlayerValues();
  const [weights, setWeights] = useState<PlayerWeights<PlayerType>>(
    WeightsManager.getInstance().loadWeights(playerValues.type)
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleWeightChange = (
    section: keyof PlayerWeights<PlayerType>,
    key: string,
    value: number
  ) => {
    setWeights((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], [key]: value }
          : value,
    }));
  };

  const handleSaveWeights = async () => {
    try {
      await WeightsManager.getInstance().saveWeights(
        playerValues.type,
        weights
      );
      setIsEditing(false);
      // Reload player with new weights
      window.location.reload();
    } catch (error) {
      console.error("Error saving weights:", error);
    }
  };

  // Add this at the top of each stats section
  const renderWeightEditor = (
    section: keyof PlayerWeights<PlayerType>,
    weights: Record<string, any>
  ) => {
    if (!isEditing) return null;

    return (
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Edit Weights</h4>
        {Object.entries(weights).map(([key, value]) => (
          <div key={key} className="flex items-center mb-2">
            <label className="mr-2">{key}:</label>
            <input
              type="number"
              step="0.1"
              value={typeof value === "object" ? value.weight : value}
              onChange={(e) =>
                handleWeightChange(section, key, parseFloat(e.target.value))
              }
              className="border rounded px-2 py-1"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveWeights}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Save Weights
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Weights
          </button>
        )}
      </div>

      {/* Performance Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Performance</h3>
        {renderWeightEditor("performanceWeights", weights.performanceWeights)}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Metric</th>
                <th className="text-right py-2 px-4">Value</th>
                <th className="text-right py-2 px-4">League Average</th>
                <th className="text-right py-2 px-4">Weight</th>
                <th className="text-right py-2 px-4">Normalized Value</th>
                <th className="text-right py-2 px-4">Weighted Value</th>
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
                        {stat.weightXNormalizedValue.toFixed(2)}
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

      {/* Media Attention Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Media Attention</h3>

        {/* Social Media Section */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">Social Media</h4>
          {renderWeightEditor("socialMediaWeights", weights.socialMediaWeights)}
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Platform</th>
                <th className="text-right py-2 px-4">Value</th>
                <th className="text-right py-2 px-4">Weight</th>
                <th className="text-right py-2 px-4">Normalized Value</th>
                <th className="text-right py-2 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {playerValues.mediaAttentionStats?.socialMediaMetrics &&
                Object.entries(
                  playerValues.mediaAttentionStats.socialMediaMetrics.stats
                ).map(([key, stat]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-600">
                      {key === "instagramFollowers"
                        ? "Instagram Followers"
                        : "Engagement Rate"}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {key === "instagramFollowers"
                        ? stat.value.toLocaleString()
                        : `${stat.value.toFixed(2)}%`}
                    </td>
                    <td className="py-2 px-4 text-right">{stat.weight}</td>
                    <td className="py-2 px-4 text-right">
                      {stat.normalizedValue.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {stat.weightXNormalizedValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-4">Final Score</td>
                <td className="py-2 px-4 text-right" colSpan={4}>
                  {playerValues.mediaAttentionStats?.socialMediaMetrics?.finalValue.toFixed(
                    2
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Media Mentions Section */}
        <div>
          <h4 className="text-md font-medium mb-3">Media Mentions</h4>
          {renderWeightEditor(
            "mediaMentionsWeights",
            weights.mediaMentionsWeights
          )}
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Source</th>
                <th className="text-right py-2 px-4">Count</th>
                <th className="text-right py-2 px-4">Max Value</th>
                <th className="text-right py-2 px-4">Weight</th>
                <th className="text-right py-2 px-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {playerValues.mediaAttentionStats?.mediaMentions &&
                Object.entries(
                  playerValues.mediaAttentionStats.mediaMentions.stats
                ).map(([key, stat]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-600">
                      {key === "googleSearches"
                        ? "Google Searches"
                        : "Twitter Mentions"}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {stat.value.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {stat.maxValue.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right">{stat.weight}</td>
                    <td className="py-2 px-4 text-right">
                      {stat.weightXNormalizedValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-4">Final Score</td>
                <td className="py-2 px-4 text-right" colSpan={4}>
                  {playerValues.mediaAttentionStats?.mediaMentions?.finalValue.toFixed(
                    2
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* External Factors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">External Factors</h3>
        {renderWeightEditor(
          "externalFactorWeights",
          weights.externalFactorWeights
        )}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Factor</th>
              <th className="text-right py-2 px-4">Value</th>
              <th className="text-right py-2 px-4">Normalization Value</th>
              <th className="text-right py-2 px-4">Normalized Value</th>
              <th className="text-right py-2 px-4">Weight</th>
              <th className="text-right py-2 px-4">Weighted Value</th>
            </tr>
          </thead>
          <tbody>
            {playerValues.extternalFactors &&
              Object.entries(playerValues.extternalFactors.stats).map(
                ([key, factor]) => (
                  <tr key={key} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-gray-600">{key}</td>
                    <td className="py-2 px-4 text-right">
                      {factor.value.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {factor.normalizationValue.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {factor.normalizedValue.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right">{factor.weight}</td>
                    <td className="py-2 px-4 text-right">
                      {factor.weightXNormalizedValue.toFixed(2)}
                    </td>
                  </tr>
                )
              )}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-2 px-4">Final Score</td>
              <td className="py-2 px-4 text-right" colSpan={5}>
                {playerValues.extternalFactors?.finalValue.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Demand Factor */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Demand Factor</h3>
        {renderWeightEditor("demandFactorWeights", weights.demandFactorWeights)}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Club</th>
              <th className="text-right py-2 px-4">World Ranking</th>
              <th className="text-right py-2 px-4">Max Ranking</th>
              <th className="text-right py-2 px-4">Competitive SS</th>
            </tr>
          </thead>
          <tbody>
            {playerValues.demandFactor?.stats.map((stat, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-gray-600">{stat.clubName}</td>
                <td className="py-2 px-4 text-right">
                  {stat.clubWorldRanking.toFixed(2)}
                </td>
                <td className="py-2 px-4 text-right">{stat.maxRanking}</td>
                <td className="py-2 px-4 text-right">
                  {stat.competetiveSS.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-2 px-4">Final Score</td>
              <td className="py-2 px-4 text-right" colSpan={3}>
                {playerValues.demandFactor?.finalValue.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Team Impact */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Team Impact</h3>
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
                    <td className="py-2 px-4 text-right">{stat.playerTotal}</td>
                    <td className="py-2 px-4 text-right">{stat.teamTotal}</td>
                    <td className="py-2 px-4 text-right">
                      {((stat.playerTotal / stat.teamTotal) * 100).toFixed(1)}%
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

      {/* Internal Demand */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Internal Demand</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Metric</th>
              <th className="text-right py-2 px-4">Value</th>
            </tr>
          </thead>
          <tbody>
            {playerValues.internalDemand && (
              <>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-600">Value</td>
                  <td className="py-2 px-4 text-right">
                    {playerValues.internalDemand.stats.value.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-600">Demand Ratio</td>
                  <td className="py-2 px-4 text-right">
                    {playerValues.internalDemand.stats.demandRatio.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-600">
                    Highest Platform Ratio
                  </td>
                  <td className="py-2 px-4 text-right">
                    {playerValues.internalDemand.stats.highestDemandRatioOnPlatform.toFixed(
                      2
                    )}
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-gray-600">
                    Total Platform Demand
                  </td>
                  <td className="py-2 px-4 text-right">
                    {playerValues.internalDemand.stats.totalPlatformDemand.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-2 px-4">Final Score</td>
                  <td className="py-2 px-4 text-right">
                    {playerValues.internalDemand.finalValue.toFixed(2)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Final Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Value Summary</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Section</th>
              <th className="text-right py-2 px-4">Final Value</th>
              <th className="text-right py-2 px-4">Weight</th>
              <th className="text-right py-2 px-4">Weighted Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Performance Statistics",
                value: playerValues.performanceStats?.finalValue || 0,
                weight: 0.3,
              },
              {
                name: "Media Attention",
                value:
                  ((playerValues.mediaAttentionStats?.socialMediaMetrics
                    ?.finalValue || 0) +
                    (playerValues.mediaAttentionStats?.mediaMentions
                      ?.finalValue || 0)) /
                  2,
                weight: 0.2,
              },
              {
                name: "Demand Factors",
                value: playerValues.demandFactor?.finalValue || 0,
                weight: 0.2,
              },
              {
                name: "External Factors",
                value: playerValues.extternalFactors?.finalValue || 0,
                weight: 0.1,
              },
              {
                name: "Impact on Team",
                value: playerValues.impactOnTeam?.finalValue || 0,
                weight: 0.1,
              },
              {
                name: "Internal Demand",
                value: playerValues.internalDemand?.finalValue || 0,
                weight: 0.1,
              },
            ].map((section) => (
              <tr key={section.name} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-gray-600">{section.name}</td>
                <td className="py-2 px-4 text-right">
                  {section.value.toFixed(3)}
                </td>
                <td className="py-2 px-4 text-right">
                  {section.weight.toFixed(1)}
                </td>
                <td className="py-2 px-4 text-right">
                  {(section.value * section.weight).toFixed(3)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-2 px-4">Total Value</td>
              <td className="py-2 px-4 text-right" colSpan={3}>
                {[...Array(6)].reduce((sum, _, i) => sum + 0, 0).toFixed(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
