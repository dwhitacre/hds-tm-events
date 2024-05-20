import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'
import { PositionPipe } from 'src/pipes/position.pipe'

@Component({
  selector: 'standings',
  template: `
    <layout>
      <div class="loading" *ngIf="storeService.loading$ | async; else standings">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #standings>
        <ng-container *ngIf="storeService.standingsVm$ | async as vm">
          <div class="standings-top">
            <ng-container *ngFor="let top of vm.top">
              <player-card
                [player]="top.player"
                [position]="top.position"
                [score]="top.score || 0"
              ></player-card>
            </ng-container>
          </div>
          <div class="standings-bottom" *ngIf="vm.bottom">
            <tops-table
              [tops]="vm.bottom"
              [playercount]="vm.playercount"
              [lastModified]="vm.lastModified"
            ></tops-table>
          </div>
        </ng-container>
      </ng-template>
    </layout>
  `,
  styles: [
    `
      .loading {
        display: flex;
        justify-content: center;
      }

      .standings-top {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
      }
      
      @media (max-width: 1268px) {
        .standings-top {
          grid-template-columns: repeat(2, 268px);
        }
      }
      
      @media (max-width: 624px) {
        .standings-top {
          grid-template-columns: repeat(1, 268px);
        }
      }

      .standings-bottom {
        margin-top: 48px;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
      }
    `,
  ]
})
export class StandingsComponent {
  constructor(public storeService: StoreService) {}
}

@NgModule({
  exports: [StandingsComponent],
  declarations: [StandingsComponent],
  imports: [CommonModule, ComponentsModule, PositionPipe],
})
export class StandingsModule {}
