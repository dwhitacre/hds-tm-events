import { Map } from './map'

export interface Campaign {
  id: number
  name: string
  media?: string
  creationtime: number
  publishtime: number
  clubid: number
  clubname: string
  leaderboarduid: string
  playlist: Array<Map>
  mediae?: unknown
  tracked: boolean
}
