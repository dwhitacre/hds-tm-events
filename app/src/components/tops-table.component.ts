import { Component, Input } from '@angular/core'
import { Top } from 'src/domain/leaderboard'
import { MatchResult } from 'src/domain/match'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'tops-table',
  template: `
    <div class="tops-table" *ngIf="tops">
      <p-table [value]="tops">
        <ng-template pTemplate="header">
          <div *ngIf="label" class="label">{{ label }}</div>
        </ng-template>
        <ng-template pTemplate="body" let-top let-rowIndex="rowIndex">
          <tr>
            <td>{{ top.position || (rowIndex + 1) | position }}</td>
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
      .label {
        font-size: 1.25rem;
        margin-bottom: 8px;
      }

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
  @Input() label?: string
  @Input() tops!: Array<Top | WeeklyResult | MatchResult>
  @Input() playercount!: number
  @Input() lastModified?: string
}
