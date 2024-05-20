import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'
import { PositionPipe } from 'src/pipes/position.pipe'
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'weekly',
  template: `
    <layout>
      <div class="loading" *ngIf="storeService.loading$ | async; else weekly">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #weekly>
        <ng-container *ngIf="storeService.weeklyVm$ | async as vm">
          <div class="weekly-header">
            <p-dropdown 
              [options]="vm.weeklyIds" 
              [ngModel]="vm.selectedWeekly"
              (onChange)="storeService.updateSelectedWeekly($event.value)"
            />
          </div>
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
              No weekly found for id: {{ vm.selectedWeekly }}
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

      .weekly-header {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
        margin-bottom: 24px;
      }

      @media (max-width: 1268px) {
        .weekly-header {
          grid-template-columns: repeat(2, 268px);
        }
      }
      
      @media (max-width: 624px) {
        .weekly-header {
          grid-template-columns: repeat(1, 268px);
        }
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
  imports: [CommonModule, ComponentsModule, PositionPipe, DropdownModule, FormsModule],
})
export class StandingsModule {}
