import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class MapService {
  #baseUrl = 'api/map'

  constructor(private httpClient: HttpClient) {}

  addMap(mapUid: string) {
    return this.httpClient.put(`${this.#baseUrl}`, {
      mapUid,
    })
  }
}
