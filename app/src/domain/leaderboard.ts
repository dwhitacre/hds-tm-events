import { Top } from './top'

export interface Leaderboard {
  tops: Array<Top> | null
  playercount: number
}
