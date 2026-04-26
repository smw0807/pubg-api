import { Injectable } from "@nestjs/common";
import { PlatformShard } from "pubg-kit";
import { PubgService } from "pubg-kit/nestjs";

@Injectable()
export class MasteryService {
  constructor(private readonly pubgService: PubgService) { }

  async getWeaponMastery(platform: PlatformShard, accountId: string) {
    const mastery = await this.pubgService.shard(platform).mastery.getWeapon(accountId);
    return mastery;
  }

  async getSurvivalMastery(platform: PlatformShard, accountId: string) {
    const mastery = await this.pubgService.shard(platform).mastery.getSurvival(accountId);
    return mastery;
  }
}