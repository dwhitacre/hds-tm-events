import { NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LayoutComponent } from "./layout.component";
import { TopBarComponent } from "./topbar.component";
import { PlayerCardComponent } from "./player-card.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PlayerRowComponent } from "./player-row.component";

@NgModule({
  imports: [ButtonModule, CardModule, ProgressSpinnerModule],
  declarations: [LayoutComponent, TopBarComponent, PlayerCardComponent, PlayerRowComponent],
  exports: [LayoutComponent, TopBarComponent, PlayerCardComponent, ProgressSpinnerModule, PlayerRowComponent],
})
export class ComponentsModule {}