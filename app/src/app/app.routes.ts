import { Route } from '@angular/router'
import { StandingsComponent } from './standings.component'
import { WeeklyComponent } from './weekly.component'

export const appRoutes: Route[] = [
  {
    path: 'standings',
    component: StandingsComponent,
  },
  {
    path: 'weekly/create',
    component: WeeklyComponent,
  },
  {
    path: '**',
    redirectTo: 'standings',
  },
]
