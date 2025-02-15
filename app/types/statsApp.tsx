export type PerformanceStats = {
  value: number;
  leaugeAvarage: number;
  weight: number;
  normalizedValue: number;
  weightXNormalizedValue: number;
};

export type MediaStats = {
  value: number;
  maxValue: number;
  weight: number;
  normalizedValue: number;
  weightXNormalizedValue: number;
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
  normalizedValue: number;
  weight: number;
  weightXNormalizedValue: number;
};

export type ImpactOnTeam = {
  playerTotal: number;
  teamTotal: number;
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
  | "redCards";

export type MidfielderPerformanceType =
  | "goalsPerGame"
  | "assistsPerGame"
  | "gamesStarted"
  | "dualsWon"
  | "minutesPerGame"
  | "successfulDribbles"
  | "keyPassesPerGame"
  | "totalMinutesPlayed"
  | "interceptionsPerGame"
  | "yellowCards"
  | "redCards";

export type DefenderPerformanceType =
  | "goalsPerGame"
  | "assistsPerGame"
  | "gamesStarted"
  | "dualsWon"
  | "minutesPerGame"
  | "interceptionsPerGame"
  | "tacklesPerGame"
  | "totalMinutesPlayed"
  | "yellowCards"
  | "redCards";

export type GoalkeeperPerformanceType =
  | "gamesStarted"
  | "savesPerGame"
  | "cleanSheets"
  | "minutesPerGame"
  | "totalMinutesPlayed"
  | "penaltiesSaved"
  | "goalsConcededPerGame"
  | "yellowCards"
  | "redCards";

export type MediaAttentionType = "socialMedia" | "mediaMentions";

export type SocialMediaMetricsType = "instagramFollowers" | "engagementRate";

export type MediaMentionsType = "googleSearches" | "twitterMentions";

export type ExternalFactorType =
  | "age"
  | "gamesInjured"
  | "teamCompetitiveness"
  | "nationalTeamStatus"
  | "captaincy";

export type ImpactOnTeamType = "goals" | "assists";

export type StatsType =
  | "performanceStats"
  | "mediaAttentionStats"
  | "demandFactor"
  | "extternalFactors"
  | "impactOnTeam"
  | "internalDemand";

export type PlayerValues<T extends PlayerType> = {
  id: number;
  type: T;
  performanceStats?: {
    stats: PerformanceStatsMap[T];
    finalValue: number;
  };
  mediaAttentionStats?: {
    socialMediaMetrics?: {
      stats: Record<SocialMediaMetricsType, MediaStats>;
      finalValue: number;
    };
    mediaMentions?: {
      stats: Record<MediaMentionsType, MediaStats>;
      finalValue: number;
    };
  };
  demandFactor?: {
    stats: DemandFactor[];
    finalValue: number;
  };
  extternalFactors?: {
    stats: Record<ExternalFactorType, ExternalFactor>;
    finalValue: number;
  };
  impactOnTeam?: {
    stats: Record<ImpactOnTeamType, ImpactOnTeam>;
    impactPercentage: number;
    finalValue: number;
  };
  internalDemand?: {
    stats: InternalDemand;
    demandRatio: number;
    highestDemandRatioOnPlatform: number;
    finalValue: number;
  };
};

export type PerformanceStatsMap = {
  Attacker: Record<AttackerPerformenceType, PerformanceStats>;
  Midfielder: Record<MidfielderPerformanceType, PerformanceStats>;
  Defender: Record<DefenderPerformanceType, PerformanceStats>;
  Goalkeeper: Record<GoalkeeperPerformanceType, PerformanceStats>;
};
