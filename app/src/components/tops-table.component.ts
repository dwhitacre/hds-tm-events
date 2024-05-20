import { Component, Input } from '@angular/core'
import { Top } from 'src/domain/leaderboard'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'tops-table',
  template: `
    <div class="tops-table" *ngIf="tops">
      <p-table [value]="tops">
        <ng-template pTemplate="body" let-top>
          <tr>
            <td>{{ top.position | position }}</td>
            <td>
              <img
                [alt]="top.player.name"
                [src]="
                  top.player.image ||
                  'assets/images/hds-events-nobg.png'
                "
                width="64"
                height="37"
                class="shadow-4"
              />
            </td>
            <td>{{ top.player.name }}</td>
            <td>{{ top.score || 0 }}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="summary">
          <div class="summary">
            <span>Total player count: {{ playercount }}</span>
            <span *ngIf="lastModified">Last Updated: {{ lastModified }}</span>
          </div>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      .tops-table {
        margin-top: 48px;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
      }

      .summary {
        display: flex;
        justify-content: space-between;
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
export class TopsTableComponent {
  @Input() tops!: Array<Top | WeeklyResult>
  @Input() playercount!: number
  @Input() lastModified?: string
}
