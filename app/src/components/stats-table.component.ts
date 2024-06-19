import { Component, Input } from '@angular/core'
import { Stat } from 'src/domain/leaderboard'

@Component({
  selector: 'stats-table',
  template: `
    <div class="stats-table" *ngIf="stats">
      <p-table
        [value]="stats"
        styleClass="p-datatable-gridlines p-datatable-sm p-datatable-striped"
        [scrollable]="true"
        [tableStyle]="{'min-width': '40rem'}">
      >
        <ng-template pTemplate="header">
          <tr class="header">
            <th></th>
            <th>Player</th>
            <th>Entries</th>
            <th>Avg Quali</th>
            <th>MB Appear</th>
            <th>Avg Result</th>
            <th>Match Record</th>
            <th>Wins</th>
            <th>Runner Ups</th>
            <th>Avg Points</th>
            <th>Total Points</th>
            <th>Earnings</th>
            <!-- <th>Nemesis</th>
            <th>Nemesis Wins</th>
            <th>Nemesis Losses</th> -->
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
            <td>{{ stat.matchWins }}-{{ stat.matchLosses }}</td>
            <td>{{ stat.weeklyWins }}</td>
            <td>{{ stat.weeklyRunnerups }}</td>
            <td>{{ stat.averageWeeklyScore | number: '1.2-2' }}</td>
            <td>{{ stat.score || 0 }}</td>
            <td>{{ stat.earningsAmount | currency: 'USD' }}</td>
            <!-- <td>{{ stat.nemesis?.name || '' }}</td>
            <td>{{ stat.nemesisWins || 0 }}</td>
            <td>{{ stat.nemesisLosses || 0 }}</td> -->
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
