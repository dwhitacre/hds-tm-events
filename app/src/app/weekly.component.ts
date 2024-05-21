import { Component, NgModule } from '@angular/core'
import { ComponentsModule } from 'src/components/components.module'
import { StoreService } from 'src/services/store.service'
import { CommonModule } from '@angular/common'
import { PositionPipe } from 'src/pipes/position.pipe'
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'
import { SelectButtonModule } from 'primeng/selectbutton';

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
            <div class="weekly-header-buffer"></div>
            <div class="weekly-header-buffer"></div>
            <div class="weekly-header-rightside">
              <p-selectButton
                [options]="viewOptions" 
                [(ngModel)]="currentView" 
                optionLabel="label" 
                optionValue="value"
              />
            </div>
          </div>
          <ng-container *ngIf="vm.found; else weeklynotfound">
            <ng-container *ngIf="currentView === 'results'; else matches">
              <tops-grid [tops]="vm.top!"></tops-grid>
              <tops-table
                [tops]="vm.bottom!"
                [playercount]="vm.playercount!"
                [lastModified]="vm.lastModified"
              ></tops-table>
            </ng-container>
            <ng-template #matches>
              <div class="weekly-matches">
                <ng-container *ngFor="let match of vm.matches">
                  <player-card
                    label="{{ match.type | titlecase }} {{ match.instance | uppercase }}"
                    [player]="match.results[0].player"
                    [position]="1"
                    [score]="match.results[0].score"
                    [player2Enabled]="true"
                    [player2]="match.results.length > 1 ? match.results[1].player : undefined"
                    [position2]="2"
                    [score2]="match.results.length > 1 ? match.results[1].score : undefined"
                  ></player-card>
                </ng-container>
              </div>
            </ng-template>
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

      .weekly-header, .weekly-matches {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
      }
      
      .weekly-header-rightside {
        display: flex;
        justify-content: flex-end;
      }
      
      .weekly-header {
        grid-row-gap: 8px;
        margin-bottom: 24px;
      }

      @media (max-width: 1268px) {
        .weekly-header, .weekly-matches {
          grid-template-columns: repeat(2, 268px);
        }

        .weekly-header-buffer {
          display: none;
        }
      }
      
      @media (max-width: 624px) {
        .weekly-header, .weekly-matches {
          grid-template-columns: repeat(1, 268px);
        }

        .weekly-header-rightside {
          justify-content: flex-start;
        }
      }
    `,
  ]
})
export class WeeklyComponent {
  viewOptions = [{ label: 'Results', value: 'results' }, { label: 'Matches', value: 'matches' }]
  currentView = 'results'

  constructor(public storeService: StoreService) {}
}

@NgModule({
  exports: [WeeklyComponent],
  declarations: [WeeklyComponent],
  imports: [CommonModule, ComponentsModule, PositionPipe, DropdownModule, FormsModule, SelectButtonModule],
})
export class StandingsModule {}
