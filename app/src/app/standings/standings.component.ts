import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StandingsStore } from './standings.store'
import { CommonModule } from '@angular/common'
import { PositionPipe } from '../../pipes/position.pipe'

@Component({
  selector: 'standings',
  template: `
    <layout>
      <div *ngIf="standingsStore.loading$ | async; else standings">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #standings>
        <ng-container *ngIf="standingsStore.vm$ | async as vm">
          <div class="standings-top">
            <ng-container *ngFor="let top of vm.top">
              <player-card
                [player]="top.player"
                [position]="top.position"
                [score]="top.score || top.time || 0"
              ></player-card>
            </ng-container>
          </div>
          <div class="standings-bottom" *ngIf="vm.bottom">
            <p-table [value]="vm.bottom">
              <ng-template pTemplate="body" let-bottom>
                <tr>
                  <td>{{ bottom.position | position }}</td>
                  <td>
                    <img
                      [alt]="bottom.player.name"
                      [src]="
                        bottom.player.image ||
                        'assets/images/hds-events-nobg.png'
                      "
                      width="64"
                      class="shadow-4"
                    />
                  </td>
                  <td>{{ bottom.player.name }}</td>
                  <td>{{ bottom.score || bottom.time || 0 }}</td>
                </tr>
              </ng-template>
              <ng-template pTemplate="summary">
                <div class="flex align-items-center justify-content-between">
                  Total player count: {{ vm.playercount }}
                </div>
              </ng-template>
            </p-table>
          </div>
        </ng-container>
      </ng-template>
    </layout>
  `,
  styles: [
    `
      .standings-top {
        display: flex;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 24px 36px;
      }

      .standings-bottom {
        margin-top: 48px;
        width: 100%;
        height: 24px;
        display: flex;
        justify-content: center;
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
  providers: [StandingsStore],
})
export class StandingsComponent {
  constructor(public standingsStore: StandingsStore) {}
}

@NgModule({
  exports: [StandingsComponent],
  declarations: [StandingsComponent],
  imports: [CommonModule, ComponentsModule, PositionPipe],
})
export class StandingsModule {}
