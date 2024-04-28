import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Leaderboard } from 'src/domain/leaderboard'

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  #baseUrl = 'assets/data/leaderboard'

  constructor(private httpClient: HttpClient) {}

  getLeaderboard(uid: string) {
    return this.httpClient.get<Leaderboard>(`${this.#baseUrl}/${uid}`)
  }
}
