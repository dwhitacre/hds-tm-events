import { Player } from './player'

export interface Match {
  matchId: string
  results: Array<MatchResult>
  playersAwarded: number
  pointsAwarded: number
  pointsResults: Array<MatchResult>
}

export interface MatchResult {
  player: Player
  score: number
}
