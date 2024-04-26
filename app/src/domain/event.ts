import { Player } from "./player";
import { PrizePool } from "./prizepool";
import { Campaign } from "./campaign";

export interface Event {
  players: Array<Player>,
  prizePool: PrizePool,
  campaign: Campaign
}