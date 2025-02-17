import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { PlayerType } from "../types/statsApp";
import { PlayerWeights } from "../types/statsDB";

export class WeightsManager {
  private static instance: WeightsManager;
  private weights: Map<PlayerType, PlayerWeights<PlayerType>>;

  private constructor() {
    this.weights = new Map();
  }

  public static getInstance(): WeightsManager {
    if (!WeightsManager.instance) {
      WeightsManager.instance = new WeightsManager();
    }
    return WeightsManager.instance;
  }

  public async initializeWeights() {
    try {
      const weightsDoc = await getDoc(doc(db, "weights", "current"));

      if (weightsDoc.exists()) {
        const data = weightsDoc.data();
        Object.entries(data).forEach(([position, weights]) => {
          this.weights.set(
            position as PlayerType,
            weights as PlayerWeights<PlayerType>
          );
        });
      } else {
        // If no weights exist, initialize with zeros
        this.initializeZeroWeights();
      }
    } catch (error) {
      console.error("Error loading weights:", error);
      this.initializeZeroWeights();
    }
  }

  private initializeZeroWeights() {
    const positions: PlayerType[] = [
      "Attacker",
      "Midfielder",
      "Defender",
      "Goalkeeper",
    ];

    positions.forEach((position) => {
      this.weights.set(position, {
        performanceWeights: this.getZeroPerformanceWeights(position),
        socialMediaWeights: {
          instagramFollowers: 0,
          engagementRate: 0,
        },
        mediaMentionsWeights: {
          googleSearches: { maxValue: 0, weight: 0 },
          twitterMentions: { maxValue: 0, weight: 0 },
        },
        demandFactorWeights: [0, 0, 0],
        externalFactorWeights: [0, 0, 0, 0, 0],
        totalPlatformDemand: 0,
        finalValueWeights: [0, 0, 0, 0, 0, 0],
      });
    });
  }

  private getZeroPerformanceWeights(position: PlayerType) {
    switch (position) {
      case "Attacker":
        return {
          gamesStarted: 0,
          minutesPerGame: 0,
          totalMinutesPlayed: 0,
          yellowCards: 0,
          redCards: 0,
          goalsPerGame: 0,
          assistsPerGame: 0,
          dualsWon: 0,
          goalConversion: 0,
          keyPassesPerGame: 0,
        };
      case "Midfielder":
        return {
          gamesStarted: 0,
          minutesPerGame: 0,
          totalMinutesPlayed: 0,
          yellowCards: 0,
          redCards: 0,
          goalsPerGame: 0,
          assistsPerGame: 0,
          dualsWon: 0,
          successfulDribbles: 0,
          keyPassesPerGame: 0,
          interceptionsPerGame: 0,
        };
      case "Defender":
        return {
          gamesStarted: 0,
          minutesPerGame: 0,
          totalMinutesPlayed: 0,
          yellowCards: 0,
          redCards: 0,
          goalsPerGame: 0,
          assistsPerGame: 0,
          dualsWon: 0,
          interceptionsPerGame: 0,
          tacklesPerGame: 0,
        };
      case "Goalkeeper":
        return {
          gamesStarted: 0,
          minutesPerGame: 0,
          totalMinutesPlayed: 0,
          yellowCards: 0,
          redCards: 0,
          savesPerGame: 0,
          cleanSheets: 0,
          penaltiesSaved: 0,
          goalsConcededPerGame: 0,
        };
    }
  }

  public async saveWeights<T extends PlayerType>(
    position: T,
    weights: PlayerWeights<T>
  ): Promise<void> {
    try {
      this.weights.set(position, weights);

      // Convert Map to object for Firestore
      const weightsObject = Object.fromEntries(this.weights);

      await setDoc(doc(db, "weights", "current"), weightsObject);
    } catch (error) {
      console.error("Error saving weights:", error);
      throw error;
    }
  }

  public loadWeights<T extends PlayerType>(position: T): PlayerWeights<T> {
    const weights = this.weights.get(position);
    if (!weights) {
      throw new Error(`No weights found for position: ${position}`);
    }
    return weights as PlayerWeights<T>;
  }
}
