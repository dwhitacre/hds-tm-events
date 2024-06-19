import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { concatLatestFrom, tapResponse } from '@ngrx/operators'
import { Observable, switchMap } from 'rxjs'
import { Leaderboard, Stat } from 'src/domain/leaderboard'
import { Weekly } from 'src/domain/weekly'
import { AdminService } from 'src/services/admin.service'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'
import { WeeklyService } from './weekly.service'
import { MatchService } from './match.service'
import { PlayerService } from './player.service'

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

  readonly players$ = this.select((state) => state.leaderboard.players.sort((playerA, playerB) => {
    if (playerA.name == playerB.name) return playerA.accountId.localeCompare(playerB.accountId)
    return playerA.name.localeCompare(playerB.name)
  }))
  readonly weeklyIds$: Observable<Array<string>> = this.select((state) => state.leaderboard.weeklies.map(leaderboardWeekly => leaderboardWeekly.weekly.weeklyId).reverse())

  readonly stats$: Observable<Array<Stat>> = this.select(this.leaderboard$, this.toplimit$, (leaderboard, toplimit) => {
    const stats = leaderboard.tops.reduce<{[_: string]: Stat}>((pv, cv) => {
      pv[cv.player.accountId] = Object.assign({}, cv, {
        weekliesPlayed: 0,
        averageWeeklyPosition: 0,
        weeklyWins: 0,
        weeklyLosses: 0,
        weeklyRunnerups: 0,
        averageWeeklyScore: 0,
        earningsAmount: 0,
        averageQualifierPosition: 0,
        qualifiedAmount: 0,
        matchWins: 0,
        matchLosses: 0,
      })
      return pv
    }, {})

    leaderboard.weeklies.forEach(leadboardWeekly => {
      leadboardWeekly.weekly.results.forEach(weeklyResult => {
        const stat = stats[weeklyResult.player.accountId]
        stat.averageWeeklyPosition = (weeklyResult.position + stat.weekliesPlayed * stat.averageWeeklyPosition) / (stat.weekliesPlayed + 1)
        stat.averageWeeklyScore = (weeklyResult.score + stat.weekliesPlayed * stat.averageWeeklyScore) / (stat.weekliesPlayed + 1)
        stat.weekliesPlayed++
        if (weeklyResult.position == 1) {
          stat.weeklyWins++
          stat.earningsAmount += 70
        }
        else if (weeklyResult.position == 2) {
          stat.weeklyRunnerups++
          stat.earningsAmount += 30
        }
        else stat.weeklyLosses++
      })

      leadboardWeekly.weekly.matches.forEach(weeklyMatch => {
        if (weeklyMatch.match.matchId.endsWith('qualifying')) {
          weeklyMatch.match.results.forEach((matchResult, idx) => {
            const stat = stats[matchResult.player.accountId]
            stat.averageQualifierPosition = ((idx + 1) + (stat.weekliesPlayed - 1) * stat.averageQualifierPosition) / stat.weekliesPlayed
            if (idx < toplimit) stat.qualifiedAmount++
          })
        } else if (weeklyMatch.match.matchId.toLowerCase().indexOf('tiebreak') < 0) {
          if (weeklyMatch.match.results.length < 2) return
          weeklyMatch.match.results.forEach((matchResult, idx) => {
            const stat = stats[matchResult.player.accountId]
            if (idx == 0) stat.matchWins++
            else stat.matchLosses++
          })
        }
      })
    })

    // TODO: special cases
    // week 1 chomp beat wolf in first round after wolf qualified 8 and chomp qualified 9
    if (stats['83b5f677-3296-4d2a-ad6b-5a100565de22']) stats['83b5f677-3296-4d2a-ad6b-5a100565de22'].qualifiedAmount++
    if (stats['fcad7ce0-49ac-4c56-ac19-ecfca890a451']) stats['fcad7ce0-49ac-4c56-ac19-ecfca890a451'].qualifiedAmount--

    return Object.values(stats)
  })

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
    this.weeklyIds$,
    this.players$,
    this.isAdmin$,
    (leaderboard, selectedWeekly, toplimit, weeklyIds, players, isAdmin) => {
      const leaderboardWeekly = leaderboard.weeklies.find(leaderboardWeekly => leaderboardWeekly.weekly.weeklyId == selectedWeekly)
      const weekly = leaderboardWeekly?.weekly
      if (!weekly) return { found: false, selectedWeekly, weeklyIds }

      const matches = weekly.matches.map((weeklyMatch) => {
        const match = weeklyMatch.match
        const matchParts = match.matchId.replace(weekly.weeklyId + '-', '').split('-')
        const type = matchParts[0] as MatchType

        return {
          ...match,
          type,
          order: matchTypeOrder.indexOf(type),
          instance: matchParts.length > 1 ? matchParts.slice(1).join(' ') : ''
        }
      }).sort((matchA, matchB) => {
        if (matchA.order == matchB.order) return matchA.instance.localeCompare(matchB.instance)
        return matchB.order - matchA.order
      })

      return {
        found: true,
        published: leaderboardWeekly?.published,
        selectedWeekly,
        weeklyIds,
        top: weekly.results.filter((_, index) => index < toplimit),
        bottom: weekly.results.filter((_, index) => index >= toplimit),
        playercount: weekly.results.length,
        lastModified: undefined,
        matches: matches.slice(0, -1),
        qualifying: matches[matches.length - 1],
        players,
        isAdmin,
      }
    }
  )

  constructor(
    private leaderboardService: LeaderboardService,
    private logService: LogService,
    private adminService: AdminService,
    private weeklyService: WeeklyService,
    private matchService: MatchService,
    private playerService: PlayerService,
  ) {
    super({
      leaderboard: {
        leaderboardId: '',
        tops: [],
        playercount: 0,
        weeklies: [],
        lastModified: new Date(0),
        players: []
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
    selectedWeekly: selectedWeekly ? selectedWeekly : state.selectedWeekly || state.leaderboard.weeklies[state.leaderboard.weeklies.length - 1].weekly.weeklyId
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

  readonly createWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      switchMap((weeklyId) => this.weeklyService.createWeekly(weeklyId).pipe(
        tapResponse({
          next: () => this.logService.success('Success', `Created new weekly: ${weeklyId}`),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.fetchLeaderboard()
        })
      ))
    )
  })

  readonly publishWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$]),
      switchMap(([weeklyId, leaderboardUid]) => this.leaderboardService.addWeeklyToLeaderboard(leaderboardUid, weeklyId).pipe(
        tapResponse({
          next: () => this.logService.success('Success', `Published weekly: ${weeklyId}`),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.fetchLeaderboard()
        })
      ))
    )
  })

  readonly addMatchResult = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId]) => this.matchService.addMatchResult(matchId, accountId).pipe(
        tapResponse({
          next: () => this.logService.success('Success', `Added match result: ${matchId}, ${accountId}`, false),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.fetchLeaderboard()
        })
      ))
    )
  })

  readonly updateMatchResult = this.effect<[string, string, number]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId, score]) => this.matchService.updateMatchResult(matchId, accountId, score).pipe(
        tapResponse({
          next: () => this.logService.success('Success', `Updated match result: ${matchId}, ${accountId}, ${score}`, false),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.fetchLeaderboard()
        })
      ))
    )
  })

  readonly deleteMatchResult = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId]) => this.matchService.deleteMatchResult(matchId, accountId).pipe(
        tapResponse({
          next: () => this.logService.success('Success', `Deleted match result: ${matchId}, ${accountId}`, false),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.fetchLeaderboard()
        })
      ))
    )
  })

  readonly addPlayer = this.effect<string>((accountId$) => {
    return accountId$.pipe(
      switchMap((accountId) => this.playerService.addPlayer(accountId).pipe(
        tapResponse({
          next: () => this.logService.success('Success', `Added player: ${accountId}`),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.fetchLeaderboard()
        })
      ))
    )
  })
}
