import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Player } from "../players/Player";
import { PlayerDBValues } from "../types/statsDB";

export class ConnectionManager {
  private static instance: ConnectionManager;

  async getPlayer(playerId: string) {
    try {
      const playerDoc = await getDoc(doc(db, "players", playerId));
      if (!playerDoc.exists()) return null;

      const player = new Player(playerDoc.data() as PlayerDBValues);
      return player;
    } catch (error) {
      console.error("Error fetching player:", error);
      throw error;
    }
  }

  getTeam() {}

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }
}
