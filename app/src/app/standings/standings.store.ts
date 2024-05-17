import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { tapResponse } from '@ngrx/operators'
import { switchMap } from 'rxjs'
import { Leaderboard } from 'src/domain/leaderboard'
import { AdminService } from 'src/services/admin.service'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'

export interface Standings {
  leaderboard: Leaderboard
  loading: boolean
  toplimit: number
  isAdmin: boolean
}

@Injectable()
export class StandingsStore extends ComponentStore<Standings> {
  #leaderboardUid = 'standings'

  readonly leaderboard$ = this.select((state) => state.leaderboard)
  readonly loading$ = this.select((state) => state.loading)
  readonly toplimit$ = this.select((state) => state.toplimit)

  readonly vm$ = this.select(
    this.leaderboard$,
    this.toplimit$,
    (leaderboard, toplimit) => {
      return {
        top: leaderboard.tops.filter((_, index) => index < toplimit),
        bottom: leaderboard.tops.filter((_, index) => index >= toplimit),
        playercount: leaderboard.playercount,
        lastModified: leaderboard.lastModified.toLocaleDateString() + ' ' + leaderboard.lastModified.toLocaleTimeString(),
      }
    },
  )

  constructor(
    private leaderboardService: LeaderboardService,
    private logService: LogService,
    private adminService: AdminService
  ) {
    super({
      leaderboard: {
        leaderboardId: '',
        tops: [],
        playercount: 0,
        weeklies: [],
        lastModified: new Date(0)
      },
      loading: true,
      toplimit: 8,
      isAdmin: false
    })

    this.fetchLeaderboard()
    this.fetchAdmin()
  }

  readonly fetchLeaderboard = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.leaderboardService.getLeaderboard(this.#leaderboardUid).pipe(
          tapResponse({
            next: (leaderboard) => {
              if (!leaderboard)
                return this.logService.error(
                  new Error('Leaderboard does not exist.'),
                )
              if (typeof leaderboard.lastModified === 'string') leaderboard.lastModified = new Date(leaderboard.lastModified)
              this.patchState({ leaderboard })
            },
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.patchState({ loading: false }),
          }),
        ),
      ),
    )
  })

  readonly fetchAdmin = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.adminService.isAdmin().pipe(
          tapResponse({
            next: () => this.patchState({ isAdmin: true }),
            error: () => this.patchState({ isAdmin: false })
          }),
        ),
      ),
    )
  })
}
