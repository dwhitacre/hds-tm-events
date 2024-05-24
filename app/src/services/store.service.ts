import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { concatLatestFrom, tapResponse } from '@ngrx/operators'
import { switchMap } from 'rxjs'
import { Leaderboard } from 'src/domain/leaderboard'
import { Weekly } from 'src/domain/weekly'
import { AdminService } from 'src/services/admin.service'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'

export interface StoreState {
  leaderboard: Leaderboard
  leaderboardUid: string
  leaderboardPublished: boolean
  loading: boolean
  toplimit: number
  isAdmin: boolean
  selectedWeekly: Weekly['weeklyId']
}

export type MatchType = 'finals' | 'semifinal' | 'quarterfinal' | 'firstround' | 'qualifying'
export const matchTypeOrder: Array<MatchType> = ['qualifying', 'firstround', 'quarterfinal', 'semifinal', 'finals']

@Injectable({ providedIn: 'root' })
export class StoreService extends ComponentStore<StoreState> {
  readonly leaderboard$ = this.select((state) => state.leaderboard)
  readonly leaderboardUid$ = this.select((state) => state.leaderboardUid)
  readonly leaderboardPublished$ = this.select((state) => state.leaderboardPublished)
  readonly loading$ = this.select((state) => state.loading)
  readonly toplimit$ = this.select((state) => state.toplimit)
  readonly isAdmin$ = this.select((state) => state.isAdmin)
  readonly selectedWeekly$ = this.select((state) => state.selectedWeekly)

  readonly players$ = this.select((state) => state.leaderboard.tops.map(top => top.player))

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

      const matches = weekly.matches.map((weeklyMatch) => {
        const match = weeklyMatch.match
        const matchParts = match.matchId.replace(weekly.weeklyId + '-', '').split('-')
        const type = matchParts[0] as MatchType

        return {
          ...match,
          type,
          order: matchTypeOrder.indexOf(type),
          instance: matchParts.length > 1 ? matchParts[1] : ''
        }
      }).sort((matchA, matchB) => {
        if (matchA.order == matchB.order) return matchA.instance.localeCompare(matchB.instance)
        return matchB.order - matchA.order
      })

      return {
        found: true,
        selectedWeekly,
        weeklyIds: leaderboard.weeklies.map(leaderboardWeekly => leaderboardWeekly.weekly.weeklyId).reverse(),
        top: weekly.results.filter((_, index) => index < toplimit),
        bottom: weekly.results.filter((_, index) => index >= toplimit),
        playercount: weekly.results.length,
        lastModified: undefined,
        matches: matches.slice(0, -1),
        qualifying: matches[matches.length - 1]
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
      leaderboardUid: 'standings',
      leaderboardPublished: true,
      loading: true,
      toplimit: 8,
      isAdmin: false,
      selectedWeekly: '',
    })

    this.fetchLeaderboard()
    this.fetchAdmin()
  }

  readonly updateSelectedWeekly = this.updater((state, selectedWeekly?: string) => ({
    ...state,
    selectedWeekly: selectedWeekly ? selectedWeekly : state.leaderboard.weeklies[state.leaderboard.weeklies.length - 1].weekly.weeklyId
  }))

  readonly toggleLeaderboardPublished = this.updater((state) => ({
    ...state,
    leaderboardPublished: !state.leaderboardPublished
  }))

  readonly fetchLeaderboard = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$, this.leaderboardPublished$]),
      switchMap(([_, leaderboardUid, leaderboardPublished]) =>
        this.leaderboardService.getLeaderboard(leaderboardUid, leaderboardPublished).pipe(
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
