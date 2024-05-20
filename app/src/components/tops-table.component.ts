import { Component, Input } from '@angular/core'
import { Top } from 'src/domain/leaderboard'

@Component({
  selector: 'tops-table',
  template: `
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
          <span>Last Updated: {{ lastModified }}</span>
        </div>
      </ng-template>
    </p-table>
  `,
  styles: [
    `
      .summary {
        display: flex;
        justify-content: space-between;
      }

      :host::ng-deep table.p-datatable-table {
        min-width: 48rem;
      }

      @media (max-width: 768px) {
        :host::ng-deep table.p-datatable-table {
          min-width: 24rem;
        }
      }
    `,
  ],
})
export class TopsTableComponent {
  @Input() tops!: Array<Top>
  @Input() playercount!: number
  @Input() lastModified!: string
}
