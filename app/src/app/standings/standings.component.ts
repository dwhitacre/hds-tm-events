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
            <player-card [player]="top.player" [position]="top.position" [score]="top.score || top.time || 0"></player-card>
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
      gap: 24px 48px;
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