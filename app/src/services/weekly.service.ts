import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class WeeklyService {
  #baseUrl = 'api/weekly'

  constructor(private httpClient: HttpClient) {}

  createWeekly(weeklyId: string) {
    return this.httpClient.put(`${this.#baseUrl}`, {
      weeklyId,
    })
  }
}
