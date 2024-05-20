import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { tapResponse } from '@ngrx/operators'
import { switchMap } from 'rxjs'
import { Leaderboard } from 'src/domain/leaderboard'
import { Weekly } from 'src/domain/weekly'
import { AdminService } from 'src/services/admin.service'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'

export interface StoreState {
  leaderboard: Leaderboard
  loading: boolean
  toplimit: number
  isAdmin: boolean
  selectedWeekly: Weekly['weeklyId']
}

@Injectable({ providedIn: 'root' })
export class StoreService extends ComponentStore<StoreState> {
  #leaderboardUid = 'standings'

  readonly leaderboard$ = this.select((state) => state.leaderboard)
  readonly loading$ = this.select((state) => state.loading)
  readonly toplimit$ = this.select((state) => state.toplimit)
  readonly isAdmin$ = this.select((state) => state.isAdmin)
  readonly players$ = this.select((state) => state.leaderboard.tops.map(top => top.player))
  readonly selectedWeekly$ = this.select((state) => state.selectedWeekly)

  readonly standingsVm$ = this.select(
    this.leaderboard$,
    this.toplimit$,
    (leaderboard, toplimit) => ({
      top: leaderboard.tops.filter((_, index) => index < toplimit),
      bottom: leaderboard.tops.filter((_, index) => index >= toplimit),
      playercount: leaderboard.playercount,
      lastModified: leaderboard.lastModified.toLocaleDateString() + ' ' + leaderboard.lastModified.toLocaleTimeString(),
    })
  )

  readonly weeklyVm$ = this.select(
    this.leaderboard$,
    this.selectedWeekly$,
    this.toplimit$,
    (leaderboard, selectedWeekly, toplimit) => {
      const weekly = leaderboard.weeklies.find(leaderboardWeekly => leaderboardWeekly.weekly.weeklyId == selectedWeekly)?.weekly
      if (!weekly) return { found: false, selectedWeekly }

      return {
        found: true,
        selectedWeekly,
        weeklyIds: leaderboard.weeklies.map(leaderboardWeekly => leaderboardWeekly.weekly.weeklyId).reverse(),
        top: weekly.results.filter((_, index) => index < toplimit),
        bottom: weekly.results.filter((_, index) => index >= toplimit),
        playercount: weekly.results.length,
        lastModified: undefined
      }
    }
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
      isAdmin: false,
      selectedWeekly: ''
    })

    this.fetchLeaderboard()
    this.fetchAdmin()
  }

  readonly updateSelectedWeekly = this.updater((state, selectedWeekly?: string) => ({
    ...state,
    selectedWeekly: selectedWeekly ? selectedWeekly : state.leaderboard.weeklies[state.leaderboard.weeklies.length - 1].weekly.weeklyId
  }))

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
              this.updateSelectedWeekly(undefined)
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
