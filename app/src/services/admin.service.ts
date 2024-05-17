import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AdminService {
  #baseUrl = 'api/admin'

  constructor(private httpClient: HttpClient) {}

  isAdmin() {
    return this.httpClient.get(this.#baseUrl)
  }
}
