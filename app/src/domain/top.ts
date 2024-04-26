import { Player } from "./player";

export interface Top {
  player: Player
  position: number
  time: number
  filename: string
  timestamp: string
  url: string
}