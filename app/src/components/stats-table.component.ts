import { Component, Input } from '@angular/core'
import { Stat } from 'src/domain/leaderboard'

@Component({
  selector: 'stats-table',
  template: `
    <div class="stats-table" *ngIf="stats">
      <p-table
        [value]="stats"
      >
        <ng-template pTemplate="header">
          <tr>
            <th></th>
            <th>Player</th>
            <th>Entries</th>
            <th>Avg Quali</th>
            <th>Bracket Appear</th>
            <th>Avg Result</th>
            <th>Match Wins</th>
            <th>Match Losses</th>
            <th>Wins</th>
            <th>Runner Ups</th>
            <th>Avg Points Earned</th>
            <th>Total Points</th>
            <th>Earnings</th>
            <th>Nemesis</th>
            <th>Nemesis Wins</th>
            <th>Nemesis Losses</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-stat let-rowIndex="rowIndex">
          <tr>
            <td>{{ stat.position || (rowIndex + 1) | position }}</td>
            <td>{{ stat.player.name }}</td>
            <td>{{ stat.weekliesPlayed }}</td>
            <td>{{ stat.averageQualifierPosition | number: '1.2-2' }}</td>
            <td>{{ stat.qualifiedAmount }}</td>
            <td>{{ stat.averageWeeklyPosition | number: '1.2-2' }}</td>
            <td>{{ stat.matchWins }}</td>
            <td>{{ stat.matchLosses }}</td>
            <td>{{ stat.weeklyWins }}</td>
            <td>{{ stat.weeklyRunnerups }}</td>
            <td>{{ stat.averageWeeklyScore | number: '1.2-2' }}</td>
            <td>{{ stat.score || 0 }}</td>
            <td>{{ stat.earningsAmount | currency: 'USD' }}</td>
            <td>{{ stat.nemesis?.name || '' }}</td>
            <td>{{ stat.nemesisWins || 0 }}</td>
            <td>{{ stat.nemesisLosses || 0 }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      .stats-table {
        margin-top: 12px;
        margin-bottom: 12px;
        display: flex;
        justify-content: center;
      }

      :host::ng-deep table.p-datatable-table {
        min-width: 48rem;
      }

      @media (max-width: 784px) {
        :host::ng-deep table.p-datatable-table {
          min-width: 24rem;
        }
      }
    `,
  ],
})
export class StatsTableComponent {
  @Input() stats!: Array<Stat>

  onImgError(event: Event) {
    if (event.target) (event.target as HTMLImageElement).src = 'assets/images/hds-events-nobg.png'
  }
}
