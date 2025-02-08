export type PerformanceStats = {
  value: number;
  leaugeAvarage: number;
  weight: number;
  normalizedValue: number;
  weightXNormaliazedValue: number;
};

export type MediaStats = {
  value: number;
  maxValue: number;
  weight: number;
  normalizedValue: number;
  normalizedValueXWeight: number;
};

export type DemandFactor = {
  clubName: string;
  clubWorldRanking: number;
  maxRanking: number;
  competetiveSS: number;
};

export type ExternalFactor = {
  value: number;
  normalizationValue: number;
  weight: number;
  normalizedValue: number;
  normalizedValueXWeight: number;
};

export type ImpactOnTeam = {
  playerTotal: number;
  teamTotal: number;
  impactPercentage: number;
};

export type InternalDemand = {
  value: number;
  demandRatio: number;
  highestDemandRatioOnPlatform: number;
  totalPlatformDemand: number;
};

export type PlayerType = "Attacker" | "Midfielder" | "Defender" | "Goalkeeper";
export type AttackerPerformenceType =
  | "goalsPerGame"
  | "assistsPerGame"
  | "gamesStarted"
  | "dualsWon"
  | "minutesPerGame"
  | "goalConversion"
  | "keyPassesPerGame"
  | "totalMinutesPlayed"
  | "yellowCards"
  | "redCards"
  | "goalConversion";

export type MidfielderPerformanceType =
  | "goalsPerGame"
  | "assistsPerGame"
  | "gamesStarted"
  | "dualsWon"
  | "minutesPerGame"
  | "goalConversion"
  | "keyPassesPerGame"
  | "totalMinutesPlayed"
  | "yellowCards"
  | "redCards"
  | "goalConversion";

export type DefenderPerformanceType =
  | "goalsPerGame"
  | "assistsPerGame"
  | "gamesStarted"
  | "dualsWon"
  | "minutesPerGame"
  | "goalConversion"
  | "keyPassesPerGame"
  | "totalMinutesPlayed"
  | "yellowCards"
  | "redCards"
  | "goalConversion";

export type GoalkeeperPerformanceType =
  | "goalsPerGame"
  | "assistsPerGame"
  | "gamesStarted"
  | "dualsWon"
  | "minutesPerGame"
  | "goalConversion"
  | "keyPassesPerGame"
  | "totalMinutesPlayed"
  | "yellowCards"
  | "redCards"
  | "goalConversion";

export type PlayerValues<T extends PlayerType> = {
  id: number;
  type: T;
  performanceStats?: {
    stats: PerformanceStatsMap[T];
    finalValue: number;
  };
  mediaAttentionStats?: {
    stats: Record<string, MediaStats>;
    finalValue: number;
  };
  demandFactor?: {
    stats: DemandFactor[];
    finalValue: number;
  };
  extternalFactors?: {
    stats: Record<string, ExternalFactor>;
    finalValue: number;
  };
  impactOnTeam?: {
    stats: Record<string, ImpactOnTeam>;
    finalValue: number;
  };
  internalDemand?: {
    stats: InternalDemand;
    finalValue: number;
  };
};

export type PerformanceStatsMap = {
  Attacker: Record<AttackerPerformenceType, PerformanceStats>;
  Midfielder: Record<MidfielderPerformanceType, PerformanceStats>;
  Defender: Record<DefenderPerformanceType, PerformanceStats>;
  Goalkeeper: Record<GoalkeeperPerformanceType, PerformanceStats>;
};
