import { PlayerType } from "../types/statsApp";
import { PlayerWeights } from "../types/statsDB";

export class WeightsManager {
  private static instance: WeightsManager;
  private weights: Map<PlayerType, PlayerWeights<PlayerType>>;

  private constructor() {
    this.weights = new Map();
    this.initializeDefaultWeights();
  }

  public static getInstance(): WeightsManager {
    if (!WeightsManager.instance) {
      WeightsManager.instance = new WeightsManager();
    }
    return WeightsManager.instance;
  }

  private initializeDefaultWeights() {
    // Attacker weights
    this.weights.set("Attacker", {
      performanceWeights: {
        goalsPerGame: 0.3,
        assistsPerGame: 0.15,
        gamesStarted: 0.1,
        dualsWon: 0.1,
        minutesPerGame: 0.1,
        goalConversion: 0.1,
        keyPassesPerGame: 0.05,
        totalMinutesPlayed: 0.05,
        yellowCards: -0.025,
        redCards: -0.075,
      },
      socialMediaWeights: {
        instagramFollowers: 0.7,
        engagementRate: 0.3,
      },
      mediaMentionsWeights: {
        googleSearches: {
          maxValue: 1000000,
          weight: 0.6,
        },
        twitterMentions: {
          maxValue: 100000,
          weight: 0.4,
        },
      },
      demandFactorWeights: [0.4, 0.3, 0.3],
      externalFactorWeights: [0.25, 0.2, 0.2, 0.2, 0.15],
      totalPlatformDemand: 1000,
      finalValueWeights: [0.4, 0.2, 0.15, 0.1, 0.1, 0.05],
    });

    // Midfielder weights
    this.weights.set("Midfielder", {
      performanceWeights: {
        goalsPerGame: 0.15,
        assistsPerGame: 0.2,
        gamesStarted: 0.1,
        dualsWon: 0.15,
        minutesPerGame: 0.1,
        successfulDribbles: 0.1,
        keyPassesPerGame: 0.1,
        totalMinutesPlayed: 0.05,
        interceptionsPerGame: 0.05,
        yellowCards: -0.025,
        redCards: -0.075,
      },
      socialMediaWeights: {
        instagramFollowers: 0.7,
        engagementRate: 0.3,
      },
      mediaMentionsWeights: {
        googleSearches: {
          maxValue: 1000000,
          weight: 0.6,
        },
        twitterMentions: {
          maxValue: 100000,
          weight: 0.4,
        },
      },
      demandFactorWeights: [0.4, 0.3, 0.3],
      externalFactorWeights: [0.25, 0.2, 0.2, 0.2, 0.15],
      totalPlatformDemand: 1000,
      finalValueWeights: [0.4, 0.2, 0.15, 0.1, 0.1, 0.05],
    });

    // Defender weights
    this.weights.set("Defender", {
      performanceWeights: {
        goalsPerGame: 0.05,
        assistsPerGame: 0.05,
        gamesStarted: 0.15,
        dualsWon: 0.2,
        minutesPerGame: 0.15,
        interceptionsPerGame: 0.15,
        tacklesPerGame: 0.15,
        totalMinutesPlayed: 0.1,
        yellowCards: -0.025,
        redCards: -0.075,
      },
      socialMediaWeights: {
        instagramFollowers: 0.7,
        engagementRate: 0.3,
      },
      mediaMentionsWeights: {
        googleSearches: {
          maxValue: 1000000,
          weight: 0.6,
        },
        twitterMentions: {
          maxValue: 100000,
          weight: 0.4,
        },
      },
      demandFactorWeights: [0.4, 0.3, 0.3],
      externalFactorWeights: [0.25, 0.2, 0.2, 0.2, 0.15],
      totalPlatformDemand: 1000,
      finalValueWeights: [0.4, 0.2, 0.15, 0.1, 0.1, 0.05],
    });

    // Goalkeeper weights
    this.weights.set("Goalkeeper", {
      performanceWeights: {
        gamesStarted: 0.15,
        savesPerGame: 0.25,
        cleanSheets: 0.2,
        minutesPerGame: 0.1,
        totalMinutesPlayed: 0.1,
        penaltiesSaved: 0.1,
        goalsConcededPerGame: -0.1,
        yellowCards: -0.025,
        redCards: -0.075,
      },
      socialMediaWeights: {
        instagramFollowers: 0.7,
        engagementRate: 0.3,
      },
      mediaMentionsWeights: {
        googleSearches: {
          maxValue: 1000000,
          weight: 0.6,
        },
        twitterMentions: {
          maxValue: 100000,
          weight: 0.4,
        },
      },
      demandFactorWeights: [0.4, 0.3, 0.3],
      externalFactorWeights: [0.25, 0.2, 0.2, 0.2, 0.15],
      totalPlatformDemand: 1000,
      finalValueWeights: [0.4, 0.2, 0.15, 0.1, 0.1, 0.05],
    });
  }

  public loadWeights<T extends PlayerType>(position: T): PlayerWeights<T> {
    const weights = this.weights.get(position);
    if (!weights) {
      throw new Error(`No weights found for position: ${position}`);
    }
    return weights as PlayerWeights<T>;
  }

  public updateWeights<T extends PlayerType>(
    position: T,
    weights: PlayerWeights<T>
  ): void {
    this.weights.set(position, weights);
  }
}
