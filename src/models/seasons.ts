export interface SeasonAttributes {
  isCurrentSeason: boolean;
  isOffseason: boolean;
}

export interface SeasonData {
  type: string;
  id: string;
  attributes: SeasonAttributes;
}

export interface SeasonMeta {
  [key: string]: unknown;
}

export interface ResponseLinks {
  self: string;
}

export interface Season {
  data: SeasonData[];
  links: ResponseLinks;
  meta: SeasonMeta;
}
