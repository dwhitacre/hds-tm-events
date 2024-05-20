import { Match } from './match'
import { Player } from './player'

export interface Weekly {
  weeklyId: string
  matches: Array<WeeklyMatch>
  results: Array<WeeklyResult>
}

export interface WeeklyMatch {
  match: Match
}

export interface WeeklyResult {
  player: Player
  score: number
  position: number
}