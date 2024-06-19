import { Route } from '@angular/router'
import { StandingsComponent } from './standings.component'
import { WeeklyComponent } from './weekly.component'
import { StatsComponent } from './stats.component'

export const appRoutes: Route[] = [
  {
    path: 'standings',
    component: StandingsComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'weekly',
    component: WeeklyComponent,
  },
  {
    path: '**',
    redirectTo: 'standings',
  },
]
