import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Campaign } from 'src/domain/campaign'

@Injectable({ providedIn: 'root' })
export class CampaignService {
  #baseUrl = 'assets/data/campaign'

  constructor(private httpClient: HttpClient) {}

  getCampaign(id: number) {
    return this.httpClient.get<Campaign>(`${this.#baseUrl}/${id}`)
  }
}
