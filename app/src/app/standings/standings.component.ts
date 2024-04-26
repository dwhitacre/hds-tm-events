import { Component, NgModule } from "@angular/core";
import { ComponentsModule } from "src/components/components.module";

@Component({
  selector: 'standings',
  template: `
    <layout>
      <div>standings</div>
    </layout>
  `,
  styles: [`
  `]
})
export class StandingsComponent {}

@NgModule({
  imports: [ComponentsModule],
  exports: [StandingsComponent],
  declarations: [StandingsComponent]
})
export class StandingsModule {}