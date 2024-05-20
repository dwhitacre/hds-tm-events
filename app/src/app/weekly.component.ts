import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'
import { PositionPipe } from 'src/pipes/position.pipe'

@Component({
  selector: 'weekly',
  template: `
    <layout>
      <div class="loading" *ngIf="storeService.loading$ | async; else weekly">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #weekly>
        <ng-container *ngIf="storeService.weeklyVm$ | async as vm">
          <ng-container *ngIf="vm.found; else weeklynotfound">
            <tops-grid [tops]="vm.top!"></tops-grid>
            <tops-table
              [tops]="vm.bottom!"
              [playercount]="vm.playercount!"
              [lastModified]="vm.lastModified"
            ></tops-table>
          </ng-container>
          <ng-template #weeklynotfound>
            <div class="weekly-not-found">
              No weekly found for id: {{ vm | json }}
            </div>
          </ng-template>
        </ng-container>
      </ng-template>
    </layout>
  `,
  styles: [
    `
      .loading, .weekly-not-found {
        display: flex;
        justify-content: center;
      }
    `,
  ]
})
export class WeeklyComponent {
  constructor(public storeService: StoreService) {}
}

@NgModule({
  exports: [WeeklyComponent],
  declarations: [WeeklyComponent],
  imports: [CommonModule, ComponentsModule, PositionPipe],
})
export class StandingsModule {}
