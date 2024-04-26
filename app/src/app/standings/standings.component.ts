import { Component, NgModule } from "@angular/core";
import { ComponentsModule } from "src/components/components.module";
import { StandingsStore } from "./standings.store";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'standings',
  template: `
    <layout>
      <div>standings</div>
      <div *ngIf="standingsStore.loading$ | async; else standings">
        loading
      </div>
      <ng-template #standings>
        <div *ngIf="standingsStore.leaderboard$ | async as leaderboard">
          {{ leaderboard | json }}
        </div>
      </ng-template>
    </layout>
  `,
  styles: [`
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