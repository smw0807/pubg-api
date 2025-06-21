export interface GameModeStats {
  assists: number;
  boosts: number;
  dBNOs: number;
  dailyKills: number;
  damageDealt: number;
  days: number;
  dailyWins: number;
  headshotKills: number;
  heals: number;
  killPoints: number;
  kills: number;
  longestKill: number;
  longestTimeSurvived: number;
  losses: number;
  maxKillStreaks: number;
  mostSurvivalTime: number;
  rankPoints: number;
  rankPointsTitle: string;
  revives: number;
  rideDistance: number;
  roadKills: number;
  roundMostKills: number;
  roundsPlayed: number;
  suicides: number;
  swimDistance: number;
  teamKills: number;
  timeSurvived: number;
  top10s: number;
  vehicleDestroys: number;
  walkDistance: number;
  weaponsAcquired: number;
  weeklyKills: number;
  weeklyWins: number;
  winPoints: number;
  wins: number;
}

export interface GameModeStatsContainer {
  duo: GameModeStats;
  'duo-fpp': GameModeStats;
  solo: GameModeStats;
  'solo-fpp': GameModeStats;
  squad: GameModeStats;
  'squad-fpp': GameModeStats;
}

export interface RelationshipData {
  type: string;
  id: string;
}

export interface Relationship {
  data: RelationshipData | RelationshipData[];
}

export interface Relationships {
  player: Relationship;
  matchesSolo: Relationship;
  matchesSoloFPP: Relationship;
  matchesDuo: Relationship;
  matchesDuoFPP: Relationship;
  matchesSquad: Relationship;
  matchesSquadFPP: Relationship;
  season: Relationship;
}

export interface NormalStatsAttributes {
  gameModeStats: GameModeStatsContainer;
  bestRankPoint: number;
}

export interface NormalStatsData {
  type: string;
  attributes: NormalStatsAttributes;
  relationships: Relationships;
}

export interface NormalStatsLinks {
  self: string;
}

export type NormalStatsMeta = Record<string, unknown>;

export interface NormalStats {
  data: NormalStatsData;
  links: NormalStatsLinks;
  meta: NormalStatsMeta;
}
