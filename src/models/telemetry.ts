export interface TelemetryLocation {
  x: number;
  y: number;
  z: number;
}

export interface TelemetryCharacter {
  name: string;
  teamId: number;
  health: number;
  location: TelemetryLocation;
  ranking: number;
  accountId: string;
  isInBlueZone: boolean;
  isInRedZone: boolean;
  zone: string[];
}

export interface TelemetryVehicle {
  vehicleType: string;
  vehicleId: string;
  health: number;
  feulPercent: number;
}

export interface TelemetryDamageInfo {
  attackType: string;
  damageTypeCategory: string;
  damageReason: string;
  damageCauserName: string;
  additionalInfo: string[];
  distance: number;
  isThroughPenetrableWall: boolean;
}

export interface TelemetryEventBase {
  _D: string;
  _T: string;
}

export interface LogPlayerPosition extends TelemetryEventBase {
  _T: 'LogPlayerPosition';
  character: TelemetryCharacter;
  vehicle: TelemetryVehicle | null;
  elapsedTime: number;
  numAlivePlayers: number;
}

export interface LogPlayerKillV2 extends TelemetryEventBase {
  _T: 'LogPlayerKillV2';
  attackId: number;
  dBNOId: number;
  victimGameResult: {
    rank: number;
    gameResult: string;
    teamId: number;
    stats: Record<string, unknown>;
    accountId: string;
  };
  victim: TelemetryCharacter;
  victimWeapon: string;
  victimWeaponAdditionalInfo: string[];
  dBNOMaker: TelemetryCharacter | null;
  dBNODamageInfo: TelemetryDamageInfo | null;
  killer: TelemetryCharacter | null;
  killerDamageInfo: TelemetryDamageInfo | null;
  assists_AccountId: string[];
  teamKillers_AccountId: string[];
  isSuicide: boolean;
}

export interface LogPlayerMakeGroggy extends TelemetryEventBase {
  _T: 'LogPlayerMakeGroggy';
  attackId: number;
  attacker: TelemetryCharacter | null;
  victim: TelemetryCharacter;
  damageTypeCategory: string;
  damageReason: string;
  damageCauserName: string;
  distance: number;
  isAttackerInVehicle: boolean;
  dBNOId: number;
  isThroughPenetrableWall: boolean;
}

export interface LogPlayerTakeDamage extends TelemetryEventBase {
  _T: 'LogPlayerTakeDamage';
  attackId: number;
  attacker: TelemetryCharacter | null;
  victim: TelemetryCharacter;
  damageTypeCategory: string;
  damageReason: string;
  damage: number;
  damageCauserName: string;
  distance: number;
  isThroughPenetrableWall: boolean;
}

export type TelemetryEvent =
  | LogPlayerPosition
  | LogPlayerKillV2
  | LogPlayerMakeGroggy
  | LogPlayerTakeDamage
  | TelemetryEventBase;
