import { NgModule } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { LayoutComponent } from './layout.component'
import { TopBarComponent } from './topbar.component'
import { PlayerCardComponent } from './player-card.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TableModule } from 'primeng/table'
import { PositionPipe } from 'src/pipes/position.pipe'
import { MenuModule } from 'primeng/menu'
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext'
import { CommonModule } from '@angular/common'
import { TopsTableComponent } from './tops-table.component'

@NgModule({
  imports: [
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    TableModule,
    PositionPipe,
    MenuModule,
    DialogModule,
    InputTextModule,
    CommonModule
  ],
  declarations: [LayoutComponent, TopBarComponent, PlayerCardComponent, TopsTableComponent],
  exports: [
    LayoutComponent,
    TopBarComponent,
    PlayerCardComponent,
    ProgressSpinnerModule,
    TopsTableComponent
  ],
})
export class ComponentsModule {}
