import { Player } from './player'

export interface Map {
  author: string
  name: string
  mapType: string
  mapStyle?: string
  authorScore: number
  goldScore: number
  silverScore: number
  bronzeScore: number
  collectionName: string
  filename: string
  isPlayable: boolean
  mapId: string
  mapUid: string
  submitter: string
  timestamp: string
  fileUrl: string
  thumbnailUrl: string
  authorplayer: Player
  submitterplayer: Player
  exchangeid: number
}
