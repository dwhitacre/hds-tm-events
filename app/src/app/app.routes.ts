import { Route } from '@angular/router'
import { StandingsComponent } from './standings/standings.component'

export const appRoutes: Route[] = [
  {
    path: 'standings',
    component: StandingsComponent,
  },
  {
    path: '**',
    redirectTo: 'standings',
  },
]
