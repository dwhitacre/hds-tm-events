import { NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LayoutComponent } from "./layout.component";
import { TopBarComponent } from "./topbar.component";
import { PlayerCardComponent } from "./player-card.component";

@NgModule({
  imports: [ButtonModule, CardModule],
  declarations: [LayoutComponent, TopBarComponent, PlayerCardComponent],
  exports: [LayoutComponent, TopBarComponent, PlayerCardComponent],
})
export class ComponentsModule {}