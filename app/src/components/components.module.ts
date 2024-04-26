import { NgModule } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { LayoutComponent } from "./layout.component";
import { TopBarComponent } from "./topbar.component";

@NgModule({
  imports: [ButtonModule],
  declarations: [LayoutComponent, TopBarComponent],
  exports: [LayoutComponent, TopBarComponent],
})
export class ComponentsModule {}