import { Component, NgModule } from "@angular/core";
import { ComponentsModule } from "src/components/components.module";
import { StandingsStore } from "./standings.store";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'standings',
  template: `
    <layout>
      <div *ngIf="standingsStore.loading$ | async; else standings">
        <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
      </div>
      <ng-template #standings>
        <div class="standings" *ngIf="standingsStore.leaderboard$ | async as leaderboard">
          <ng-container *ngFor="let top of leaderboard.tops">
            <ng-container *ngIf="top.position < 9; else loser">
              <player-card [player]="top.player" [position]="top.position" [score]="top.score || top.time || 0"></player-card>
            </ng-container>
            <ng-template #loser>
              <player-row [player]="top.player" [position]="top.position" [score]="top.score || top.time || 0"></player-row>
            </ng-template>
          </ng-container>
        </div>
      </ng-template>
    </layout>
  `,
  styles: [`
    .standings {
      display: flex;
      justify-content: center;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 24px 36px;
    }

    player-row {
      width: 100%;
      height: 16px;
      display: flex;
      justify-content: center;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 24px 36px;
    }
  `],
  providers: [StandingsStore]
})
export class StandingsComponent {
  constructor(public standingsStore: StandingsStore) {}
}

@NgModule({
  imports: [CommonModule, ComponentsModule],
  exports: [StandingsComponent],
  declarations: [StandingsComponent],
})
export class StandingsModule {}