import { PlayerDBValues } from "../types/statsDB";
import {
  AttackerPerformenceType,
  PerformanceStats,
  PerformanceStatsMap,
  PlayerType,
  PlayerValues,
} from "../types/statsApp";

export class Player<T extends PlayerType> {
  private playerValues: PlayerValues<T>;
  private playerDBValues: PlayerDBValues;

  constructor(data: PlayerDBValues) {
    this.playerValues = this.mapPlayerValues(data);
    this.playerDBValues = data;
  }

  /**
   * Maps the raw PlayerDB data into structured playerValues
   */
  private mapPlayerValues(data: PlayerDBValues): PlayerValues<T> {
    const performanceStats = this.calculatePerformanceStats(data);
    const demandFactor = this.calculateDemandFactor(data);
    const impactOnTeam = this.calculateImpactOnTeam(data);
    const internalDemand = this.calculateInternalDemand(data);
    const externalFactors = this.calculateExternalFactors(data);
    const mediaAttentionStats = this.calculateMediaAttentionStats(data);

    return {
      id: data.id,
      type: data.position as T, // Assuming position maps correctly to PlayerType
      performanceStats,
      demandFactor,
      impactOnTeam,
      internalDemand,
      extternalFactors: externalFactors,
      mediaAttentionStats,
    };
  }

  /**
   * Calculate performance statistics from PlayerDB
   */
  private calculatePerformanceStats(
    data: PlayerDBValues
  ): PlayerValues<T>["performanceStats"] {
    const stats = data.statistics[0]; // Using first entry
    if (!stats) return undefined;

    // Base stats common to all positions
    const baseStats = {
      gamesStarted: this.createPerformanceStat(stats.games.lineups, 10, 0.2),
      minutesPerGame: this.createPerformanceStat(
        stats.games.minutes / (stats.games.appearences || 1),
        90,
        0.2
      ),
      totalMinutesPlayed: this.createPerformanceStat(
        stats.games.minutes,
        900,
        0.1
      ),
      yellowCards: this.createPerformanceStat(stats.cards.yellow, 5, -0.1),
      redCards: this.createPerformanceStat(stats.cards.red, 1, -0.3),
    };

    // Position specific stats
    let positionStats = {};
    switch (data.position as T) {
      case "Attacker":
        positionStats = {
          goalsPerGame: this.createPerformanceStat(
            stats.goals.total / (stats.games.appearences || 1),
            0.5,
            0.3
          ),
          assistsPerGame: this.createPerformanceStat(
            (stats.assists || 0) / (stats.games.appearences || 1),
            0.3,
            0.2
          ),
          dualsWon: this.createPerformanceStat(stats.duels.won || 0, 20, 0.2),
          goalConversion: this.createPerformanceStat(
            (stats.shots.on || 0) / (stats.shots.total || 1),
            0.5,
            0.2
          ),
          keyPassesPerGame: this.createPerformanceStat(
            (stats.passes.key || 0) / (stats.games.appearences || 1),
            2,
            0.1
          ),
        };
        break;

      case "Midfielder":
        positionStats = {
          goalsPerGame: this.createPerformanceStat(
            stats.goals.total / (stats.games.appearences || 1),
            0.2,
            0.2
          ),
          assistsPerGame: this.createPerformanceStat(
            (stats.assists || 0) / (stats.games.appearences || 1),
            0.3,
            0.3
          ),
          dualsWon: this.createPerformanceStat(stats.duels.won || 0, 20, 0.2),
          successfulDribbles: this.createPerformanceStat(
            stats.dribbles.success || 0,
            5,
            0.2
          ),
          keyPassesPerGame: this.createPerformanceStat(
            (stats.passes.key || 0) / (stats.games.appearences || 1),
            3,
            0.3
          ),
          interceptionsPerGame: this.createPerformanceStat(
            (stats.tackles.interceptions || 0) / (stats.games.appearences || 1),
            2,
            0.2
          ),
        };
        break;

      case "Defender":
        positionStats = {
          goalsPerGame: this.createPerformanceStat(
            stats.goals.total / (stats.games.appearences || 1),
            0.1,
            0.1
          ),
          assistsPerGame: this.createPerformanceStat(
            (stats.assists || 0) / (stats.games.appearences || 1),
            0.1,
            0.1
          ),
          dualsWon: this.createPerformanceStat(stats.duels.won || 0, 20, 0.3),
          interceptionsPerGame: this.createPerformanceStat(
            (stats.tackles.interceptions || 0) / (stats.games.appearences || 1),
            3,
            0.3
          ),
          tacklesPerGame: this.createPerformanceStat(
            (stats.tackles.total || 0) / (stats.games.appearences || 1),
            3,
            0.3
          ),
        };
        break;

      case "Goalkeeper":
        positionStats = {
          savesPerGame: this.createPerformanceStat(
            (stats.goals.saves || 0) / (stats.games.appearences || 1),
            3,
            0.3
          ),
          cleanSheets: this.createPerformanceStat(0, 1, 0.3), // Need to add this to PlayerStatistics
          penaltiesSaved: this.createPerformanceStat(
            stats.penalty.saved || 0,
            1,
            0.2
          ),
          goalsConcededPerGame: this.createPerformanceStat(
            (stats.goals.conceded || 0) / (stats.games.appearences || 1),
            1,
            -0.3
          ),
        };
        break;
    }

    const mappedStats = {
      ...baseStats,
      ...positionStats,
    } as PerformanceStatsMap[T];

    const finalValue = Object.values(mappedStats).reduce(
      (sum, stat) => sum + (stat?.weightXNormaliazedValue ?? 0),
      0
    );

    return {
      stats: mappedStats,
      finalValue,
    };
  }

  /**
   * Example function for demand factor calculation
   */
  private calculateDemandFactor(
    data: PlayerDBValues
  ): PlayerValues<T>["demandFactor"] {
    return {
      stats: [
        {
          clubName: data.teamName,
          clubWorldRanking: Math.random() * 100, // Replace with real data
          maxRanking: 100,
          competetiveSS: Math.random(),
        },
      ],
      finalValue: Math.random() * 10, // Replace with real calculation
    };
  }

  /**
   * Example function for impact on team calculation
   */
  private calculateImpactOnTeam(
    data: PlayerDBValues
  ): PlayerValues<T>["impactOnTeam"] {
    return {
      stats: {
        totalGoals: {
          playerTotal: data.statistics[0]?.goals.total ?? 0,
          teamTotal: Math.random() * 50, // Replace with actual team data
          impactPercentage: Math.random() * 100, // Compute real percentage
        },
      },
      finalValue: Math.random() * 10,
    };
  }

  /**
   * Example function for internal demand
   */
  private calculateInternalDemand(
    data: PlayerDBValues
  ): PlayerValues<T>["internalDemand"] {
    return {
      stats: {
        value: Math.random() * 10, // Replace with actual calculation
        demandRatio: Math.random(),
        highestDemandRatioOnPlatform: 1,
        totalPlatformDemand: 1000,
      },
      finalValue: Math.random() * 10,
    };
  }

  /**
   * Example function for external factors
   */
  private calculateExternalFactors(
    data: PlayerDBValues
  ): PlayerValues<T>["extternalFactors"] {
    return {
      stats: {
        injuryRisk: {
          value: Math.random(),
          normalizationValue: 1,
          weight: -0.5,
          normalizedValue: Math.random(),
          normalizedValueXWeight: Math.random() * -0.5,
        },
      },
      finalValue: Math.random() * 10,
    };
  }

  /**
   * Example function for media attention stats
   */
  private calculateMediaAttentionStats(
    data: PlayerDBValues
  ): PlayerValues<T>["mediaAttentionStats"] {
    return {
      stats: {
        socialMediaFollowers: {
          value: Math.random() * 1e6,
          maxValue: 1e6,
          weight: 0.3,
          normalizedValue: Math.random(),
          normalizedValueXWeight: Math.random() * 0.3,
        },
      },
      finalValue: Math.random() * 10,
    };
  }

  /**
   * Helper function to create a PerformanceStat
   */
  private createPerformanceStat(
    value: number,
    leagueAverage: number,
    weight: number
  ): PerformanceStats {
    const normalizedValue = value / leagueAverage;
    return {
      value,
      leaugeAvarage: leagueAverage,
      weight,
      normalizedValue,
      weightXNormaliazedValue: normalizedValue * weight,
    };
  }

  /**
   * Get player values
   */
  getPlayerValues(): PlayerValues<T> {
    return this.playerValues;
  }

  /**
   * Get player values
   */
  getPlayerDBValues(): PlayerDBValues {
    return this.playerDBValues;
  }

  /**
   * Get performance stats
   */
  getPerformanceStats() {
    return this.playerValues.performanceStats?.stats;
  }
}
