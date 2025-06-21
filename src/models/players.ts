// 기본 타입 정의
export interface PlayerStats {
  [key: string]: unknown;
}

export interface PlayerAssets {
  [key: string]: unknown;
}

export interface PlayerMeta {
  [key: string]: unknown;
}

// 매치 관계 타입
export interface MatchData {
  id: string;
  type: string;
}

// 플레이어 속성 타입
export interface PlayerAttributes {
  name: string;
  shardId: string;
  stats: PlayerStats;
  createdAt: string;
  updatedAt: string;
  patchVersion: string;
  banType: string;
  titleId: string;
}

// 플레이어 관계 타입
export interface PlayerRelationships {
  assets: {
    data: PlayerAssets;
  };
  matches: {
    data: MatchData[];
  };
}

// 링크 타입
export interface PlayerLinks {
  schema: string;
  self: string;
}

// 플레이어 데이터 아이템 타입
export interface PlayerDataItem {
  type: string;
  id: string;
  attributes: PlayerAttributes;
  relationships: PlayerRelationships;
  links: PlayerLinks;
}

// 응답 링크 타입
export interface ResponseLinks {
  self: string;
}

// 메인 Player 인터페이스
export interface Player {
  data: PlayerDataItem[];
  links: ResponseLinks;
  meta: PlayerMeta;
}
