import { PlayerMeta } from "./playermeta"
import { Zone } from "./zone"

export interface Player {
  name: string
  tag?: string
  id: string
  zone: Zone
  meta?: PlayerMeta
  image?: string
}