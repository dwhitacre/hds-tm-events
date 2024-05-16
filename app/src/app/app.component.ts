import { HttpClientModule } from '@angular/common/http'
import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { PositionPipe } from 'src/pipes/position.pipe'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'

@Component({
  standalone: true,
  imports: [RouterModule, ToastModule, HttpClientModule],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast></p-toast>
  `,
  styles: [],
  providers: [
    LeaderboardService,
    LogService,
    MessageService,
    PositionPipe,
  ],
})
export class AppComponent {
  title = 'app'
}
