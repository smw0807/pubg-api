import { Injectable, Logger } from '@nestjs/common';
import { PubgService } from '@/pubg/pubg.service';
import { MatchesService } from '@/matches/matches.service';
import { PlatformType } from '@/constants/platform';
import { Asset } from '@/models/matches';
import {
  TelemetryEvent,
  LogPlayerPosition,
  LogPlayerKillV2,
  LogPlayerMakeGroggy,
  LogPlayerTakeDamage,
} from '@/models/telemetry';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    private readonly pubgService: PubgService,
    private readonly matchesService: MatchesService,
  ) {}

  private async fetchTelemetry(
    platform: PlatformType,
    matchId: string,
  ): Promise<TelemetryEvent[]> {
    const match = await this.matchesService.getMatches(platform, matchId);

    const asset = match.included.find(
      (item): item is Asset => item.type === 'asset',
    );

    if (!asset) {
      this.logger.warn(`No telemetry asset found for match ${matchId}`);
      return [];
    }

    return this.pubgService.GETTelemetry<TelemetryEvent[]>(
      asset.attributes.URL,
    );
  }

  async getMovementLog(
    platform: PlatformType,
    matchId: string,
    playerName?: string,
  ) {
    const events = await this.fetchTelemetry(platform, matchId);
    let positions = events.filter(
      (e): e is LogPlayerPosition => e._T === 'LogPlayerPosition',
    );

    if (playerName) {
      positions = positions.filter(
        e => e.character.name.toLowerCase() === playerName.toLowerCase(),
      );
    }

    return positions.map(e => ({
      timestamp: e._D,
      playerName: e.character.name,
      location: {
        x: Math.round(e.character.location.x),
        y: Math.round(e.character.location.y),
        z: Math.round(e.character.location.z),
      },
      health: e.character.health,
      elapsedTime: e.elapsedTime,
      numAlivePlayers: e.numAlivePlayers,
    }));
  }

  async getKillLog(
    platform: PlatformType,
    matchId: string,
    playerName?: string,
  ) {
    const events = await this.fetchTelemetry(platform, matchId);
    let kills = events.filter(
      (e): e is LogPlayerKillV2 => e._T === 'LogPlayerKillV2',
    );

    if (playerName) {
      kills = kills.filter(
        e =>
          e.victim.name.toLowerCase() === playerName.toLowerCase() ||
          e.killer?.name.toLowerCase() === playerName.toLowerCase(),
      );
    }

    return kills
      .map(e => ({
        timestamp: e._D,
        killer: e.killer
          ? {
              name: e.killer.name,
              teamId: e.killer.teamId,
              location: e.killer.location,
              health: e.killer.health,
            }
          : null,
        victim: {
          name: e.victim.name,
          teamId: e.victim.teamId,
          location: e.victim.location,
          health: e.victim.health,
        },
        weapon: e.killerDamageInfo?.damageCauserName ?? 'Unknown',
        damageType: e.killerDamageInfo?.damageTypeCategory ?? null,
        distance: e.killerDamageInfo?.distance ?? null,
        isSuicide: e.isSuicide,
        assists: e.assists_AccountId,
      }));
  }

  async getGroggyLog(
    platform: PlatformType,
    matchId: string,
    playerName?: string,
  ) {
    const events = await this.fetchTelemetry(platform, matchId);
    let groggies = events.filter(
      (e): e is LogPlayerMakeGroggy => e._T === 'LogPlayerMakeGroggy',
    );

    if (playerName) {
      groggies = groggies.filter(
        e =>
          e.victim.name.toLowerCase() === playerName.toLowerCase() ||
          e.attacker?.name.toLowerCase() === playerName.toLowerCase(),
      );
    }

    return groggies
      .map(e => ({
        timestamp: e._D,
        attacker: e.attacker
          ? {
              name: e.attacker.name,
              teamId: e.attacker.teamId,
              location: e.attacker.location,
            }
          : null,
        victim: {
          name: e.victim.name,
          teamId: e.victim.teamId,
          location: e.victim.location,
          health: e.victim.health,
        },
        weapon: e.damageCauserName,
        damageType: e.damageTypeCategory,
        damageReason: e.damageReason,
        distance: e.distance,
      }));
  }

  async getDamageLog(
    platform: PlatformType,
    matchId: string,
    playerName?: string,
  ) {
    const events = await this.fetchTelemetry(platform, matchId);
    let damages = events.filter(
      (e): e is LogPlayerTakeDamage => e._T === 'LogPlayerTakeDamage',
    );

    if (playerName) {
      damages = damages.filter(
        e =>
          e.victim.name.toLowerCase() === playerName.toLowerCase() ||
          e.attacker?.name.toLowerCase() === playerName.toLowerCase(),
      );
    }

    return damages.map(e => ({
      timestamp: e._D,
      attacker: e.attacker
        ? {
            name: e.attacker.name,
            teamId: e.attacker.teamId,
            location: e.attacker.location,
          }
        : null,
      victim: {
        name: e.victim.name,
        teamId: e.victim.teamId,
        location: e.victim.location,
        health: e.victim.health,
      },
      damage: e.damage,
      weapon: e.damageCauserName,
      damageType: e.damageTypeCategory,
      damageReason: e.damageReason,
      distance: e.distance,
    }));
  }
}
