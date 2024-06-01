import { Player } from './player'
import { Weekly } from './weekly'

export interface Leaderboard {
  leaderboardId: string
  tops: Array<Top>
  playercount: number
  weeklies: Array<LeaderboardWeekly>
  lastModified: Date
  players: Array<Player>
}

export interface LeaderboardWeekly {
  weekly: Weekly
  published: boolean
}

export interface Top {
  player: Player
  position: number
  score: number
}
