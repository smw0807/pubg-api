// PUBG Match API 응답 인터페이스

export interface MatchResponse {
  data: Match;
  included: (Participant | Roster | Asset)[];
  links: {
    self: string;
  };
  meta: Record<string, unknown>;
}

export interface Match {
  type: 'match';
  id: string;
  attributes: MatchAttributes;
  relationships: MatchRelationships;
  links: {
    self: string;
    schema: string;
  };
}

export interface MatchAttributes {
  gameMode: GameMode;
  seasonState: SeasonState;
  createdAt: string;
  duration: number;
  stats: MatchStats | null;
  titleId: string;
  shardId: ShardId;
  tags: string[] | null;
  mapName: MapName;
  isCustomMatch: boolean;
  matchType: MatchType;
}

export interface MatchStats {
  // 매치 레벨 통계가 필요한 경우 여기에 추가
  [key: string]: unknown;
}

export interface MatchRelationships {
  rosters: {
    data: RosterReference[];
  };
  assets: {
    data: AssetReference[];
  };
}

export interface RosterReference {
  type: 'roster';
  id: string;
}

export interface AssetReference {
  type: 'asset';
  id: string;
}

export interface Participant {
  type: 'participant';
  id: string;
  attributes: ParticipantAttributes;
}

export interface ParticipantAttributes {
  shardId: ShardId;
  stats: ParticipantStats;
  actor: string;
}

export interface ParticipantStats {
  DBNOs: number;
  assists: number;
  boosts: number;
  damageDealt: number;
  deathType: DeathType;
  headshotKills: number;
  heals: number;
  killPlace: number;
  killStreaks: number;
  kills: number;
  longestKill: number;
  name: string;
  playerId: string;
  revives: number;
  rideDistance: number;
  roadKills: number;
  swimDistance: number;
  teamKills: number;
  timeSurvived: number;
  vehicleDestroys: number;
  walkDistance: number;
  weaponsAcquired: number;
  winPlace: number;
}

export interface Roster {
  type: 'roster';
  id: string;
  attributes: RosterAttributes;
  relationships: RosterRelationships;
}

export interface RosterAttributes {
  stats: RosterStats;
  won: string;
  shardId: ShardId;
}

export interface RosterStats {
  rank: number;
  teamId: number;
}

export interface RosterRelationships {
  team: {
    data: TeamData | null;
  };
  participants: {
    data: ParticipantReference[];
  };
}

export interface TeamData {
  type: 'team';
  id: string;
}

export interface ParticipantReference {
  type: 'participant';
  id: string;
}

export interface Asset {
  type: 'asset';
  id: string;
  attributes: AssetAttributes;
}

export interface AssetAttributes {
  name: string;
  description: string;
  createdAt: string;
  URL: string;
}

// 유틸리티 타입들
export type IncludedItem = Participant | Roster | Asset;

// 게임 모드 타입
export type GameMode =
  | 'solo'
  | 'duo'
  | 'squad'
  | 'solo-fpp'
  | 'duo-fpp'
  | 'squad-fpp';

// 시즌 상태 타입
export type SeasonState = 'progress' | 'closed';

// 매치 타입
export type MatchType = 'competitive' | 'normal' | 'esports';

// 데스 타입
export type DeathType = 'byplayer' | 'byzone' | 'alive' | 'suicide' | 'logout';

// 맵 이름 타입
export type MapName =
  | 'DihorOtok_Main'
  | 'Erangel_Main'
  | 'Baltic_Main'
  | 'Desert_Main'
  | 'Savage_Main'
  | 'Paramo_Main'
  | 'Tiger_Main'
  | 'Kiki_Main'
  | 'Camp_Jackal_Main'
  | 'Neon_Main'
  | 'Rondo_Main';

// 샤드 ID 타입
export type ShardId =
  | 'kakao'
  | 'steam'
  | 'tournament'
  | 'psn'
  | 'xbox'
  | 'console'
  | 'stadia';
