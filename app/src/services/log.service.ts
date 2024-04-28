import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private messageService: MessageService) {}

  error(error: HttpErrorResponse) {
    console.error(error)
    this.messageService.add({
      severity: 'error',
      summary: error.name,
      detail: error.message,
      sticky: true,
    })
  }
}
