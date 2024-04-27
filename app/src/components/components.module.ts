import { NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LayoutComponent } from "./layout.component";
import { TopBarComponent } from "./topbar.component";
import { PlayerCardComponent } from "./player-card.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

@NgModule({
  imports: [ButtonModule, CardModule, ProgressSpinnerModule, TableModule],
  declarations: [LayoutComponent, TopBarComponent, PlayerCardComponent, ],
  exports: [LayoutComponent, TopBarComponent, PlayerCardComponent, ProgressSpinnerModule, TableModule],
})
export class ComponentsModule {}