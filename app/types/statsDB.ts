import {
  AttackerPerformenceType,
  DefenderPerformanceType,
  GoalkeeperPerformanceType,
  MidfielderPerformanceType,
  PlayerType,
  PerformanceStatsMap,
} from "./statsApp";

export interface PlayerDBValues {
  id: number;
  weight: number;
  height: number;
  firstName: string;
  lastName: string;
  name: string;
  nationality: string;
  age: number;
  position: string;
  photo: string;
  teamId: number;
  teamName: string;
  statistics: PlayerStatistics[];
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface PlayerStatistics {
  team: Team;
  league: League;
  games: Games;
  goals: Goals;
  assists?: number;
  penalty: Penalty;
  dribbles: Dribbles;
  tackles: Tackles;
  passes: Passes;
  duels: Duels;
  shots: Shots;
  fouls: Fouls;
  substitutes: Substitutes;
  cards: Cards;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface League {
  id: number;
  name: string;
  logo: string;
  country: string;
  season: number;
  flag: string;
}

interface Games {
  appearences: number;
  position: string;
  rating: string | null;
  minutes: number;
  captain: boolean;
  number: number | null;
  lineups: number;
}

interface Goals {
  total: number;
  assists: number | null;
  saves: number | null;
  conceded?: number | null;
}

interface Penalty {
  missed: number | null;
  saved: number | null;
  commited: number | null;
  won: number | null;
  scored: number | null;
}

interface Dribbles {
  past: number | null;
  success: number | null;
  attempts: number | null;
}

interface Tackles {
  total: number | null;
  interceptions: number | null;
  blocks: number | null;
}

interface Passes {
  key: number | null;
  total: number | null;
  accuracy: number | null;
}

interface Duels {
  total: number | null;
  won: number | null;
}

interface Shots {
  total: number | null;
  on: number | null;
}

interface Fouls {
  committed: number | null;
  drawn: number | null;
}

interface Substitutes {
  in: number;
  out: number;
  bench: number;
}

interface Cards {
  yellow: number;
  red: number;
  yellowred: number;
}

export type PlayerWeights<T extends PlayerType> = {
  performanceWeights: Record<keyof PerformanceWeightsMap[T], number>;
  socialMediaWeights: SocialMediaWeights;
  mediaMentionsWeights: MediaMentionsWeights;
  demandFactorWeights: number[];
  externalFactorWeights: number[];
  totalPlatformDemand: number;
  finalValueWeights: number[];
};

export type PlayerStatsWeights = PerformanceWeightsMap[PlayerType];

export type SocialMediaWeights = {
  instagramFollowers: number;
  engagementRate: number;
};

export type MediaMentionsWeights = {
  googleSearches: MediaAttentionValue;
  twitterMentions: MediaAttentionValue;
};

export type PerformanceWeightsMap = {
  Attacker: Record<AttackerPerformenceType, number>;
  Midfielder: Record<MidfielderPerformanceType, number>;
  Defender: Record<DefenderPerformanceType, number>;
  Goalkeeper: Record<GoalkeeperPerformanceType, number>;
};

export type MediaAttentionValue = {
  maxValue: number;
  weight: number;
};
