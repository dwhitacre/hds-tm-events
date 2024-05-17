import { Injectable } from "@angular/core"

@Injectable({ providedIn: 'root' })
export class StorageService {
  #adminkey = "hds-tm-events.admin-key"

  saveAdminKey(value: string) {
    localStorage.setItem(this.#adminkey, value)
  }

  getAdminKey() {
    return localStorage.getItem(this.#adminkey)
  }

  hasAdminKey() {
    return !!this.getAdminKey()
  }
}
