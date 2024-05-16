import { Player } from './player'
import { Weekly } from './weekly'

export interface Leaderboard {
  leaderboardId: string
  tops: Array<Top>
  playercount: number
  weeklies: Array<LeaderboardWeekly>
  lastModified: Date
}

export interface LeaderboardWeekly {
  weekly: Weekly
}

export interface Top {
  player: Player
  position: number
  score: number
}
