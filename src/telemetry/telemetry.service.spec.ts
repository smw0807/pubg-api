import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { PubgService } from 'pubg-kit/nestjs';
import { MatchesService } from '@/matches/matches.service';
import type { TelemetryEvent, LogPlayerPosition, LogPlayerKillV2, LogPlayerMakeGroggy, LogPlayerTakeDamage, Asset } from 'pubg-kit';

// ---- Helpers ----
const makeCharacter = (name: string, teamId = 1) => ({
  name,
  teamId,
  health: 100,
  location: { x: 100, y: 200, z: 0 },
  ranking: 0,
  accountId: `account.${name}`,
});

const makePositionEvent = (playerName: string, elapsedTime = 10, numAlive = 50): LogPlayerPosition =>
  ({
    _T: 'LogPlayerPosition',
    _D: '2024-01-01T00:00:10Z',
    character: { ...makeCharacter(playerName), location: { x: 1500.7, y: 2500.3, z: 10.5 } },
    elapsedTime,
    numAlivePlayers: numAlive,
  } as unknown as LogPlayerPosition);

const makeKillEvent = (killerName: string | null, victimName: string, isSuicide = false): LogPlayerKillV2 =>
  ({
    _T: 'LogPlayerKillV2',
    _D: '2024-01-01T00:05:00Z',
    killer: killerName ? makeCharacter(killerName) : null,
    victim: makeCharacter(victimName),
    killerDamageInfo: {
      damageCauserName: 'WeaponM416',
      damageTypeCategory: 'Damage_Gun',
      distance: 150.5,
    },
    isSuicide,
    assists_AccountId: [],
  } as unknown as LogPlayerKillV2);

const makeGroggyEvent = (attackerName: string | null, victimName: string): LogPlayerMakeGroggy =>
  ({
    _T: 'LogPlayerMakeGroggy',
    _D: '2024-01-01T00:04:00Z',
    attacker: attackerName ? makeCharacter(attackerName) : null,
    victim: { ...makeCharacter(victimName), health: 0 },
    damageCauserName: 'WeaponSKS',
    damageTypeCategory: 'Damage_Gun',
    damageReason: 'ArmShot',
    distance: 200,
  } as unknown as LogPlayerMakeGroggy);

const makeDamageEvent = (attackerName: string | null, victimName: string, damage: number): LogPlayerTakeDamage =>
  ({
    _T: 'LogPlayerTakeDamage',
    _D: '2024-01-01T00:03:00Z',
    attacker: attackerName ? makeCharacter(attackerName) : null,
    victim: { ...makeCharacter(victimName), health: 80 },
    damage,
    damageCauserName: 'WeaponM416',
    damageTypeCategory: 'Damage_Gun',
    damageReason: 'TorsoShot',
    distance: 100,
  } as unknown as LogPlayerTakeDamage);

const mockAsset: Asset = {
  type: 'asset',
  id: 'asset-1',
  attributes: {
    URL: 'https://telemetry.example.com/telemetry.json',
    name: 'telemetry',
    description: '',
    createdAt: '2024-01-01T00:00:00Z',
  },
} as unknown as Asset;

const mockMatchData = {
  data: { id: 'match-1', type: 'match', attributes: { gameMode: 'squad', mapName: 'Erangel_Main', duration: 1800, createdAt: '2024-01-01T00:00:00Z' } },
  included: [mockAsset],
};

const mockMatchDataNoAsset = {
  data: mockMatchData.data,
  included: [],
};

// ---- Mock setup ----
const mockShardResult = {
  telemetry: { get: jest.fn() },
};

const mockPubgService = {
  shard: jest.fn().mockReturnValue(mockShardResult),
};

const mockMatchesService = {
  getMatches: jest.fn(),
};

describe('TelemetryService', () => {
  let service: TelemetryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryService,
        { provide: PubgService, useValue: mockPubgService },
        { provide: MatchesService, useValue: mockMatchesService },
      ],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
  });

  it('정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  // ---- getMovementLog ----
  describe('getMovementLog', () => {
    it('playerName 필터가 없을 때 모든 위치 이벤트를 반환해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makePositionEvent('Alpha') as unknown as TelemetryEvent,
        makePositionEvent('Beta') as unknown as TelemetryEvent,
        { _T: 'LogMatchStart', _D: '2024-01-01T00:00:00Z' } as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getMovementLog('steam', 'match-1');

      expect(result).toHaveLength(2);
    });

    it('playerName으로 필터링해야 한다 (대소문자 무시)', async () => {
      const events: TelemetryEvent[] = [
        makePositionEvent('Alpha') as unknown as TelemetryEvent,
        makePositionEvent('Beta') as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getMovementLog('steam', 'match-1', 'alpha');

      expect(result).toHaveLength(1);
      expect(result[0].playerName).toBe('Alpha');
    });

    it('위치 좌표를 반올림해야 한다', async () => {
      const events: TelemetryEvent[] = [makePositionEvent('Alpha') as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getMovementLog('steam', 'match-1');

      expect(result[0].location.x).toBe(1501);
      expect(result[0].location.y).toBe(2500);
      expect(result[0].location.z).toBe(11);
    });

    it('텔레메트리 에셋이 없을 때 빈 배열을 반환해야 한다', async () => {
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchDataNoAsset);

      const result = await service.getMovementLog('steam', 'match-1');

      expect(result).toHaveLength(0);
      expect(mockShardResult.telemetry.get).not.toHaveBeenCalled();
    });

    it('numAlivePlayers와 elapsedTime을 포함해야 한다', async () => {
      const events: TelemetryEvent[] = [makePositionEvent('Alpha', 120, 30) as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getMovementLog('steam', 'match-1');

      expect(result[0].elapsedTime).toBe(120);
      expect(result[0].numAlivePlayers).toBe(30);
    });
  });

  // ---- getKillLog ----
  describe('getKillLog', () => {
    it('playerName 필터가 없을 때 모든 킬 이벤트를 반환해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeKillEvent('Alpha', 'Beta') as unknown as TelemetryEvent,
        makeKillEvent('Gamma', 'Delta') as unknown as TelemetryEvent,
        { _T: 'LogMatchStart', _D: '' } as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getKillLog('steam', 'match-1');

      expect(result).toHaveLength(2);
    });

    it('킬러 playerName으로 필터링해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeKillEvent('Alpha', 'Beta') as unknown as TelemetryEvent,
        makeKillEvent('Gamma', 'Delta') as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getKillLog('steam', 'match-1', 'Alpha');

      expect(result).toHaveLength(1);
      expect(result[0].killer?.name).toBe('Alpha');
    });

    it('피해자 playerName으로 필터링해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeKillEvent('Alpha', 'Beta') as unknown as TelemetryEvent,
        makeKillEvent('Gamma', 'Delta') as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getKillLog('steam', 'match-1', 'Beta');

      expect(result).toHaveLength(1);
      expect(result[0].victim.name).toBe('Beta');
    });

    it('킬러가 null일 때 처리해야 한다 (자살/존 킬)', async () => {
      const events: TelemetryEvent[] = [makeKillEvent(null, 'Beta', true) as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getKillLog('steam', 'match-1');

      expect(result[0].killer).toBeNull();
      expect(result[0].isSuicide).toBe(true);
    });

    it('무기 및 거리 정보를 포함해야 한다', async () => {
      const events: TelemetryEvent[] = [makeKillEvent('Alpha', 'Beta') as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getKillLog('steam', 'match-1');

      expect(result[0].weapon).toBe('WeaponM416');
      expect(result[0].distance).toBe(150.5);
      expect(result[0].damageType).toBe('Damage_Gun');
    });

    it('텔레메트리에 킬이 없을 때 빈 배열을 반환해야 한다', async () => {
      const events: TelemetryEvent[] = [{ _T: 'LogMatchStart', _D: '' } as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getKillLog('steam', 'match-1');

      expect(result).toHaveLength(0);
    });
  });

  // ---- getGroggyLog ----
  describe('getGroggyLog', () => {
    it('playerName 필터가 없을 때 모든 그로기 이벤트를 반환해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeGroggyEvent('Alpha', 'Beta') as unknown as TelemetryEvent,
        makeGroggyEvent('Gamma', 'Delta') as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getGroggyLog('steam', 'match-1');

      expect(result).toHaveLength(2);
    });

    it('공격자 playerName으로 필터링해야 한다 (대소문자 무시)', async () => {
      const events: TelemetryEvent[] = [
        makeGroggyEvent('Alpha', 'Beta') as unknown as TelemetryEvent,
        makeGroggyEvent('Gamma', 'Delta') as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getGroggyLog('steam', 'match-1', 'alpha');

      expect(result).toHaveLength(1);
      expect(result[0].attacker?.name).toBe('Alpha');
    });

    it('피해자 playerName으로 필터링해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeGroggyEvent('Alpha', 'Beta') as unknown as TelemetryEvent,
        makeGroggyEvent('Gamma', 'Delta') as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getGroggyLog('steam', 'match-1', 'Delta');

      expect(result).toHaveLength(1);
      expect(result[0].victim.name).toBe('Delta');
    });

    it('공격자가 null일 때 처리해야 한다', async () => {
      const events: TelemetryEvent[] = [makeGroggyEvent(null, 'Beta') as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getGroggyLog('steam', 'match-1');

      expect(result[0].attacker).toBeNull();
    });

    it('텔레메트리 에셋이 없을 때 빈 배열을 반환해야 한다', async () => {
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchDataNoAsset);

      const result = await service.getGroggyLog('steam', 'match-1');

      expect(result).toHaveLength(0);
    });
  });

  // ---- getDamageLog ----
  describe('getDamageLog', () => {
    it('playerName 필터가 없을 때 모든 데미지 이벤트를 반환해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeDamageEvent('Alpha', 'Beta', 50) as unknown as TelemetryEvent,
        makeDamageEvent('Gamma', 'Delta', 30) as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getDamageLog('steam', 'match-1');

      expect(result).toHaveLength(2);
    });

    it('공격자 playerName으로 필터링해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeDamageEvent('Alpha', 'Beta', 50) as unknown as TelemetryEvent,
        makeDamageEvent('Gamma', 'Delta', 30) as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getDamageLog('steam', 'match-1', 'Alpha');

      expect(result).toHaveLength(1);
      expect(result[0].attacker?.name).toBe('Alpha');
    });

    it('피해자 playerName으로 필터링해야 한다', async () => {
      const events: TelemetryEvent[] = [
        makeDamageEvent('Alpha', 'Beta', 50) as unknown as TelemetryEvent,
        makeDamageEvent('Gamma', 'Delta', 30) as unknown as TelemetryEvent,
      ];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getDamageLog('steam', 'match-1', 'Delta');

      expect(result).toHaveLength(1);
      expect(result[0].victim.name).toBe('Delta');
    });

    it('공격자가 null일 때 처리해야 한다 (존 데미지)', async () => {
      const events: TelemetryEvent[] = [makeDamageEvent(null, 'Beta', 25) as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getDamageLog('steam', 'match-1');

      expect(result[0].attacker).toBeNull();
      expect(result[0].damage).toBe(25);
    });

    it('데미지량과 무기 정보를 포함해야 한다', async () => {
      const events: TelemetryEvent[] = [makeDamageEvent('Alpha', 'Beta', 75) as unknown as TelemetryEvent];
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchData);
      mockShardResult.telemetry.get.mockResolvedValueOnce(events);

      const result = await service.getDamageLog('steam', 'match-1');

      expect(result[0].damage).toBe(75);
      expect(result[0].weapon).toBe('WeaponM416');
      expect(result[0].damageType).toBe('Damage_Gun');
      expect(result[0].distance).toBe(100);
    });

    it('텔레메트리 에셋이 없을 때 빈 배열을 반환해야 한다', async () => {
      mockMatchesService.getMatches.mockResolvedValueOnce(mockMatchDataNoAsset);

      const result = await service.getDamageLog('steam', 'match-1');

      expect(result).toHaveLength(0);
    });
  });
});
