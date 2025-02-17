import {
  PlayerDBValues,
  PlayerWeights,
  PlayerStatistics,
} from "../types/statsDB";
import {
  PerformanceStats,
  PerformanceStatsMap,
  PlayerType,
  PlayerValues,
  ExternalFactor,
  MediaStats,
} from "../types/statsApp";
import { WeightsManager } from "../managers/WeightManager";

export class Player<T extends PlayerType> {
  private playerValues: PlayerValues<T>;
  private playerDBValues: PlayerDBValues;
  private weights: PlayerWeights<T>;

  constructor(data: PlayerDBValues) {
    this.playerDBValues = data;
    this.weights = WeightsManager.getInstance().loadWeights(data.position as T);
    this.playerValues = this.mapPlayerValues(data);
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
    const stats = data.statistics[0];
    if (!stats) return undefined;

    // Get position-specific weights
    const weights = this.weights.performanceWeights;

    // Base stats common to all positions
    const baseStats = {
      gamesStarted: this.createPerformanceStat(
        stats.games.lineups,
        10,
        weights.gamesStarted
      ),
      minutesPerGame: this.createPerformanceStat(
        stats.games.minutes / (stats.games.appearences || 1),
        90,
        weights.minutesPerGame
      ),
      totalMinutesPlayed: this.createPerformanceStat(
        stats.games.minutes,
        900,
        weights.totalMinutesPlayed
      ),
      yellowCards: this.createPerformanceStat(
        stats.cards.yellow,
        5,
        weights.yellowCards
      ),
      redCards: this.createPerformanceStat(
        stats.cards.red,
        1,
        weights.redCards
      ),
    };

    // Position specific stats based on T
    const positionStats = this.calculatePositionSpecificStats(stats, weights);

    const mappedStats = {
      ...baseStats,
      ...positionStats,
    } as PerformanceStatsMap[T];

    const finalValue = Object.values(mappedStats).reduce(
      (sum, stat) => sum + (stat.value / stat.normalizedValue) * stat.weight,
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
        goals: {
          playerTotal: data.statistics[0]?.goals.total ?? 0,
          teamTotal: Math.random() * 50,
        },
        assists: {
          playerTotal: data.statistics[0]?.assists ?? 0,
          teamTotal: Math.random() * 30,
        },
      },
      impactPercentage: Math.random() * 100,
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
        value: Math.random() * 10,
        demandRatio: Math.random(),
        highestDemandRatioOnPlatform: 1,
        totalPlatformDemand: 1000,
      },
      demandRatio: Math.random(),
      highestDemandRatioOnPlatform: 1,
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
        age: this.createExternalFactor(
          data.age,
          35,
          this.weights.externalFactorWeights.age
        ),
        gamesInjured: this.createExternalFactor(
          Math.random() * 10,
          10,
          this.weights.externalFactorWeights.gamesInjured
        ),
        teamCompetitiveness: this.createExternalFactor(
          Math.random() * 100,
          100,
          this.weights.externalFactorWeights.teamCompetitiveness
        ),
        nationalTeamStatus: this.createExternalFactor(
          Math.random(),
          1,
          this.weights.externalFactorWeights.nationalTeamStatus
        ),
        captaincy: this.createExternalFactor(
          data.statistics[0]?.games.captain ? 1 : 0,
          1,
          this.weights.externalFactorWeights.captaincy
        ),
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
    const stats = {
      socialMediaMetrics: {
        stats: {
          instagramFollowers: this.createMediaStat(
            Math.random() * 1e6,
            1e6,
            this.weights.socialMediaWeights.instagramFollowers.weight
          ),
          engagementRate: this.createMediaStat(
            Math.random() * 100,
            100,
            this.weights.socialMediaWeights.engagementRate.weight
          ),
        },
        finalValue: Math.random() * 10,
      },
      mediaMentions: {
        stats: {
          googleSearches: this.createMediaStat(
            Math.random() * 1e5,
            1e5,
            this.weights.mediaMentionsWeights.googleSearches.weight
          ),
          twitterMentions: this.createMediaStat(
            Math.random() * 1e4,
            1e4,
            this.weights.mediaMentionsWeights.twitterMentions.weight
          ),
        },
        finalValue: Math.random() * 10,
      },
    };
    console.log("Calculated Media Stats:", stats);
    return stats;
  }

  /**
   * Helper function to create a PerformanceStat
   */
  private createPerformanceStat(
    value: number,
    leagueAverage: number,
    weight: number
  ): PerformanceStats {
    return {
      value,
      leaugeAvarage: leagueAverage,
      weight,
      normalizedValue: value / leagueAverage,
      weightXNormalizedValue: (value / leagueAverage) * weight,
    };
  }

  /**
   * Helper function to create an ExternalFactor
   */
  private createExternalFactor(
    value: number,
    normalizationValue: number,
    weight: number
  ): ExternalFactor {
    const normalizedValue = value / normalizationValue;
    return {
      value,
      normalizationValue,
      weight,
      normalizedValue,
      weightXNormalizedValue: normalizedValue * weight,
    };
  }

  /**
   * Helper function to create a MediaStat
   */
  private createMediaStat(
    value: number,
    maxValue: number,
    weight: number
  ): MediaStats {
    return {
      value,
      maxValue,
      weight,
      normalizedValue: value / maxValue,
      weightXNormalizedValue: (value / maxValue) * weight,
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

  private calculatePositionSpecificStats(
    stats: PlayerStatistics,
    weights: Record<string, number>
  ): Partial<PerformanceStatsMap[T]> {
    switch (this.playerDBValues.position as T) {
      case "Attacker":
        return {
          goalsPerGame: this.createPerformanceStat(
            stats.goals.total / (stats.games.appearences || 1),
            0.5,
            weights.goalsPerGame
          ),
          assistsPerGame: this.createPerformanceStat(
            (stats.assists || 0) / (stats.games.appearences || 1),
            0.3,
            weights.assistsPerGame
          ),
          dualsWon: this.createPerformanceStat(
            stats.duels.won || 0,
            stats.duels.total || 1,
            weights.dualsWon
          ),
          goalConversion: this.createPerformanceStat(
            stats.goals.total / (stats.shots.total || 1),
            0.2,
            weights.goalConversion
          ),
          keyPassesPerGame: this.createPerformanceStat(
            (stats.passes.key || 0) / (stats.games.appearences || 1),
            2,
            weights.keyPassesPerGame
          ),
        } as PerformanceStatsMap[T];

      case "Midfielder":
        return {
          goalsPerGame: this.createPerformanceStat(
            stats.goals.total / (stats.games.appearences || 1),
            0.3,
            weights.goalsPerGame
          ),
          assistsPerGame: this.createPerformanceStat(
            (stats.assists || 0) / (stats.games.appearences || 1),
            0.4,
            weights.assistsPerGame
          ),
          dualsWon: this.createPerformanceStat(
            stats.duels.won || 0,
            stats.duels.total || 1,
            weights.dualsWon
          ),
          successfulDribbles: this.createPerformanceStat(
            stats.dribbles.success || 0,
            stats.dribbles.attempts || 1,
            weights.successfulDribbles
          ),
          keyPassesPerGame: this.createPerformanceStat(
            (stats.passes.key || 0) / (stats.games.appearences || 1),
            3,
            weights.keyPassesPerGame
          ),
          interceptionsPerGame: this.createPerformanceStat(
            (stats.tackles.interceptions || 0) / (stats.games.appearences || 1),
            2,
            weights.interceptionsPerGame
          ),
        } as PerformanceStatsMap[T];

      case "Defender":
        return {
          goalsPerGame: this.createPerformanceStat(
            stats.goals.total / (stats.games.appearences || 1),
            0.1,
            weights.goalsPerGame
          ),
          assistsPerGame: this.createPerformanceStat(
            (stats.assists || 0) / (stats.games.appearences || 1),
            0.2,
            weights.assistsPerGame
          ),
          dualsWon: this.createPerformanceStat(
            stats.duels.won || 0,
            stats.duels.total || 1,
            weights.dualsWon
          ),
          interceptionsPerGame: this.createPerformanceStat(
            (stats.tackles.interceptions || 0) / (stats.games.appearences || 1),
            3,
            weights.interceptionsPerGame
          ),
          tacklesPerGame: this.createPerformanceStat(
            (stats.tackles.total || 0) / (stats.games.appearences || 1),
            3,
            weights.tacklesPerGame
          ),
        } as PerformanceStatsMap[T];

      case "Goalkeeper":
        return {
          savesPerGame: this.createPerformanceStat(
            (stats.goals.saves || 0) / (stats.games.appearences || 1),
            3,
            weights.savesPerGame
          ),
          cleanSheets: this.createPerformanceStat(
            stats.games.lineups - (stats.goals.conceded || 0),
            stats.games.lineups,
            weights.cleanSheets
          ),
          penaltiesSaved: this.createPerformanceStat(
            stats.penalty.saved || 0,
            stats.penalty.scored || 1,
            weights.penaltiesSaved
          ),
          goalsConcededPerGame: this.createPerformanceStat(
            (stats.goals.conceded || 0) / (stats.games.appearences || 1),
            1,
            weights.goalsConcededPerGame
          ),
        } as PerformanceStatsMap[T];

      default:
        return {};
    }
  }
}
