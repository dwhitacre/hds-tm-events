import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { concatLatestFrom, tapResponse } from '@ngrx/operators'
import { Observable, switchMap, tap } from 'rxjs'
import { Leaderboard, Stat } from 'src/domain/leaderboard'
import { Weekly, WeeklyResult } from 'src/domain/weekly'
import { Map } from 'src/domain/map'
import { MatchType, MatchDecorated, matchTypeOrder } from 'src/domain/match'
import { AdminService } from 'src/services/admin.service'
import { LeaderboardService } from 'src/services/leaderboard.service'
import { LogService } from 'src/services/log.service'
import { WeeklyService } from './weekly.service'
import { MatchService } from './match.service'
import { PlayerService } from './player.service'
import { MapService } from './map.service'
import { Player } from 'src/domain/player'

export interface StoreState {
  leaderboard: Leaderboard
  leaderboardUid: Leaderboard['leaderboardId']
  leaderboardPublished: boolean
  loading: boolean
  toplimit: number
  isAdmin: boolean
  selectedWeekly: Weekly['weeklyId']
  nemesisWeights: {
    win: number
    loss: number
    match: number
  }
  maps: Array<Map>
  weeklies: { [weeklyId: Weekly['weeklyId']]: Partial<Weekly> }
}

@Injectable({ providedIn: 'root' })
export class StoreService extends ComponentStore<StoreState> {
  readonly leaderboard$ = this.select((state) => state.leaderboard)
  readonly leaderboardUid$ = this.select((state) => state.leaderboardUid)
  readonly leaderboardPublished$ = this.select((state) => state.leaderboardPublished)
  readonly loading$ = this.select((state) => state.loading)
  readonly toplimit$ = this.select((state) => state.toplimit)
  readonly isAdmin$ = this.select((state) => state.isAdmin)
  readonly selectedWeekly$ = this.select((state) => state.selectedWeekly)
  readonly nemesisWeights$ = this.select((state) => state.nemesisWeights)
  readonly maps$ = this.select((state) => state.maps)
  readonly weeklies$ = this.select((state) => state.weeklies)

  readonly players$ = this.select((state) =>
    state.leaderboard.players.sort((playerA, playerB) => {
      if (playerA.name == playerB.name) return playerA.accountId.localeCompare(playerB.accountId)
      return playerA.name.localeCompare(playerB.name)
    }),
  )
  readonly weeklyIds$: Observable<Array<string>> = this.select((state) =>
    state.leaderboard.weeklies.map((leaderboardWeekly) => leaderboardWeekly.weekly.weeklyId).reverse(),
  )

  readonly stats$: Observable<Array<Stat>> = this.select(
    this.leaderboard$,
    this.toplimit$,
    this.nemesisWeights$,
    (leaderboard, toplimit, nemesisWeights) => {
      const stats = leaderboard.tops.reduce<{ [_: string]: Stat }>((pv, cv) => {
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
          mapWins: 0,
          mapLosses: 0,
          opponents: {},
          opponentsSorted: [],
        })
        return pv
      }, {})

      leaderboard.weeklies.forEach((leadboardWeekly) => {
        leadboardWeekly.weekly.results.forEach((weeklyResult) => {
          const stat = stats[weeklyResult.player.accountId]
          if (weeklyResult.position <= toplimit) {
            stat.averageWeeklyPosition =
              (weeklyResult.position + stat.qualifiedAmount * stat.averageWeeklyPosition) / (stat.qualifiedAmount + 1)
            stat.qualifiedAmount++
          }
          stat.averageWeeklyScore =
            (weeklyResult.score + stat.weekliesPlayed * stat.averageWeeklyScore) / (stat.weekliesPlayed + 1)
          stat.weekliesPlayed++
          if (weeklyResult.position > 2) stat.weeklyLosses++
        })

        leadboardWeekly.weekly.matches.forEach((weeklyMatch) => {
          if (weeklyMatch.match.matchId.endsWith('qualifying')) {
            weeklyMatch.match.results.forEach((matchResult, idx) => {
              const stat = stats[matchResult.player.accountId]
              stat.averageQualifierPosition =
                (idx + 1 + (stat.weekliesPlayed - 1) * stat.averageQualifierPosition) / stat.weekliesPlayed
            })
          } else if (weeklyMatch.match.matchId.toLowerCase().indexOf('tiebreak') < 0) {
            if (weeklyMatch.match.results.length < 2) return
            if (weeklyMatch.match.results[0].score === 0 && weeklyMatch.match.results[1].score === 0) return

            if (weeklyMatch.match.matchId.endsWith('-finals')) {
              stats[weeklyMatch.match.results[0].player.accountId].weeklyWins++
              stats[weeklyMatch.match.results[0].player.accountId].earningsAmount += 70
              stats[weeklyMatch.match.results[1].player.accountId].weeklyRunnerups++
              stats[weeklyMatch.match.results[1].player.accountId].earningsAmount += 30
            }

            weeklyMatch.match.results.forEach((matchResultA, idxA) => {
              const statA = stats[matchResultA.player.accountId]
              if (idxA == 0) statA.matchWins++
              else statA.matchLosses++

              weeklyMatch.match.results.forEach((matchResultB, idxB) => {
                const statB = stats[matchResultB.player.accountId]
                if (idxA != idxB) {
                  statB.opponents[matchResultA.player.accountId] ??= {
                    player: matchResultA.player,
                    matchWins: 0,
                    matchLosses: 0,
                    mapWins: 0,
                    mapLosses: 0,
                  }
                  if (idxB == 0) statB.opponents[matchResultA.player.accountId].matchWins++
                  else statB.opponents[matchResultA.player.accountId].matchLosses++
                }
              })

              // TODO map data was not captured in this weekly, skip
              if (leadboardWeekly.weekly.weeklyId == '2024-04-27') return

              statA.mapWins += matchResultA.score
              weeklyMatch.match.results.forEach((matchResultB, idxB) => {
                if (idxA != idxB) {
                  statA.mapLosses += matchResultB.score

                  statA.opponents[matchResultB.player.accountId] ??= {
                    player: matchResultB.player,
                    matchWins: 0,
                    matchLosses: 0,
                    mapWins: 0,
                    mapLosses: 0,
                  }
                  statA.opponents[matchResultB.player.accountId].mapWins += matchResultA.score
                  statA.opponents[matchResultB.player.accountId].mapLosses += matchResultB.score
                }
              })
            })
          }
        })
      })

      const calcWeighted = (wins: number, losses: number) => {
        return (
          ((wins + 1) * nemesisWeights.win) / ((losses + 1) * nemesisWeights.loss) +
          nemesisWeights.match / (wins + losses)
        )
      }

      return Object.values(stats).map((stat) => {
        stat.opponentsSorted = Object.values(stat.opponents).sort((opponentA, opponentB) => {
          return (
            calcWeighted(opponentA.matchWins, opponentA.matchLosses) -
            calcWeighted(opponentB.matchWins, opponentB.matchLosses)
          )
        })

        if (stat.opponentsSorted.length > 0) {
          stat.nemesis = stat.opponentsSorted[0].player
          stat.nemesisWins = stat.opponentsSorted[0].matchWins
          stat.nemesisLosses = stat.opponentsSorted[0].matchLosses
        }

        return stat
      })
    },
  )

  readonly standingsVm$ = this.select(this.leaderboard$, this.toplimit$, (leaderboard, toplimit) => ({
    top: leaderboard.tops.filter((_, index) => index < toplimit),
    bottom: leaderboard.tops.filter((_, index) => index >= toplimit),
    playercount: leaderboard.playercount,
    lastModified: leaderboard.lastModified.toLocaleDateString() + ' ' + leaderboard.lastModified.toLocaleTimeString(),
  }))

  readonly statsVm$ = this.select(this.stats$, this.isAdmin$, (stats, isAdmin) => ({
    stats,
    isAdmin,
  }))

  readonly weeklyVm$ = this.select(
    this.leaderboard$,
    this.selectedWeekly$,
    this.toplimit$,
    this.weeklyIds$,
    this.players$,
    this.isAdmin$,
    this.weeklies$,
    (leaderboard, selectedWeekly, toplimit, weeklyIds, players, isAdmin, weeklies) => {
      const leaderboardWeekly = leaderboard.weeklies.find(
        (leaderboardWeekly) => leaderboardWeekly.weekly.weeklyId == selectedWeekly,
      )
      const weekly = Object.assign({}, leaderboardWeekly?.weekly, weeklies[selectedWeekly])
      if (!weekly) return { found: false, selectedWeekly, weeklyIds }

      const matches: Array<MatchDecorated> = weekly.matches
        .map((weeklyMatch) => {
          const match = weeklyMatch.match
          const matchParts = match.matchId.replace(weekly.weeklyId + '-', '').split('-')
          const type = matchParts[0] as MatchType
          const displayPositions = [1, 2]

          const decoratedMatch = {
            ...match,
            type,
            order: matchTypeOrder.indexOf(type),
            instance: matchParts.length > 1 ? matchParts.slice(1).join(' ') : '',
            displayPositions,
          }

          if (decoratedMatch.type === 'quarterfinal' && ['a', 'i'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [1, 8]
          else if (decoratedMatch.type === 'quarterfinal' && ['b', 'j'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [4, 5]
          else if (decoratedMatch.type === 'quarterfinal' && ['c', 'k'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [3, 6]
          else if (decoratedMatch.type === 'quarterfinal' && ['d', 'l'].includes(decoratedMatch.instance))
            decoratedMatch.displayPositions = [2, 7]
          else if (decoratedMatch.type === 'quarterfinal' && decoratedMatch.instance === 'tiebreak a')
            decoratedMatch.displayPositions = [5, -1]
          else if (decoratedMatch.type === 'quarterfinal' && decoratedMatch.instance === 'tiebreak b')
            decoratedMatch.displayPositions = [6, -1]
          else if (decoratedMatch.type === 'quarterfinal' && decoratedMatch.instance === 'tiebreak c')
            decoratedMatch.displayPositions = [7, -1]
          else if (decoratedMatch.type === 'semifinal' && decoratedMatch.instance === 'tiebreak')
            decoratedMatch.displayPositions = [3, 4]

          return decoratedMatch
        })
        .sort((matchA, matchB) => {
          if (matchA.order == matchB.order) return matchA.instance.localeCompare(matchB.instance)
          return matchB.order - matchA.order
        })

      // TODO support maps in consuming components
      const maps: Array<WeeklyResult> = (weekly.maps ?? []).map(
        (map) =>
          ({
            player: { name: map.name, image: map.thumbnailUrl } as Player,
          } as WeeklyResult),
      )

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
        maps,
      }
    },
  )

  constructor(
    private leaderboardService: LeaderboardService,
    private logService: LogService,
    private adminService: AdminService,
    private weeklyService: WeeklyService,
    private matchService: MatchService,
    private playerService: PlayerService,
    private mapService: MapService,
  ) {
    super({
      leaderboard: {
        leaderboardId: '',
        tops: [],
        playercount: 0,
        weeklies: [],
        lastModified: new Date(0),
        players: [],
      },
      leaderboardUid: 'standings',
      leaderboardPublished: true,
      loading: true,
      toplimit: 8,
      isAdmin: false,
      selectedWeekly: '',
      nemesisWeights: {
        win: 0.5,
        loss: 0.3,
        match: 1.4,
      },
      maps: [],
      weeklies: {},
    })

    this.fetchLeaderboard()
    this.fetchMaps()
    this.fetchAdmin()
  }

  readonly updateSelectedWeeklyState = this.updater((state, selectedWeekly?: string) => ({
    ...state,
    selectedWeekly: selectedWeekly
      ? selectedWeekly
      : state.selectedWeekly || state.leaderboard.weeklies[state.leaderboard.weeklies.length - 1].weekly.weeklyId,
  }))

  readonly updateSelectedWeekly = this.effect<string>((selectedWeekly$) => {
    return selectedWeekly$.pipe(
      tap((selectedWeekly) => this.fetchWeekly(selectedWeekly)),
      tap((selectedWeekly) => this.updateSelectedWeeklyState(selectedWeekly)),
    )
  })

  readonly toggleLeaderboardPublished = this.updater((state) => ({
    ...state,
    leaderboardPublished: !state.leaderboardPublished,
  }))

  readonly fetchLeaderboard = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$, this.leaderboardPublished$]),
      switchMap(([_, leaderboardUid, leaderboardPublished]) =>
        this.leaderboardService.getLeaderboard(leaderboardUid, leaderboardPublished).pipe(
          tapResponse({
            next: (leaderboard) => {
              if (!leaderboard) return this.logService.error(new Error('Leaderboard does not exist.'))
              if (typeof leaderboard.lastModified === 'string')
                leaderboard.lastModified = new Date(leaderboard.lastModified)
              this.patchState({ leaderboard })
              this.updateSelectedWeeklyState(undefined)
              this.updateSelectedWeekly(this.state().selectedWeekly)
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
        this.adminService.validate().pipe(
          tapResponse({
            next: () => this.patchState({ isAdmin: true }),
            error: () => this.patchState({ isAdmin: false }),
          }),
        ),
      ),
    )
  })

  readonly updateAdmin = this.effect<string>((key$) => {
    return key$.pipe(
      tap((key) => {
        this.adminService.save(key)
        this.logService.success('Success', 'Saved admin key')
        return this.fetchAdmin()
      }),
    )
  })

  readonly updateWeeklyMaps = this.updater((state, [weeklyId, maps]: [string, Array<Map>]) => ({
    ...state,
    weeklies: {
      ...state.weeklies,
      [weeklyId]: {
        ...(state.weeklies[weeklyId] ?? {}),
        maps,
      },
    },
  }))

  readonly fetchWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      switchMap((weeklyId) =>
        this.weeklyService.getWeeklyMaps(weeklyId).pipe(
          tapResponse({
            next: (maps) => this.updateWeeklyMaps([weeklyId, maps]),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly addWeeklyMap = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([weeklyId, mapUid]) =>
        this.weeklyService.addWeeklyMap(weeklyId, mapUid).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added map: ${mapUid} to weekly: ${weeklyId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchWeekly(weeklyId),
          }),
        ),
      ),
    )
  })

  readonly createWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      switchMap((weeklyId) =>
        this.weeklyService.createWeekly(weeklyId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Created new weekly: ${weeklyId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly publishWeekly = this.effect<string>((weeklyId$) => {
    return weeklyId$.pipe(
      concatLatestFrom(() => [this.leaderboardUid$]),
      switchMap(([weeklyId, leaderboardUid]) =>
        this.leaderboardService.addWeeklyToLeaderboard(leaderboardUid, weeklyId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Published weekly: ${weeklyId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly addMatchResult = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId]) =>
        this.matchService.addMatchResult(matchId, accountId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added match result: ${matchId}, ${accountId}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly updateMatchResult = this.effect<[string, string, number]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId, score]) =>
        this.matchService.updateMatchResult(matchId, accountId, score).pipe(
          tapResponse({
            next: () =>
              this.logService.success('Success', `Updated match result: ${matchId}, ${accountId}, ${score}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly deleteMatchResult = this.effect<[string, string]>((trigger$) => {
    return trigger$.pipe(
      switchMap(([matchId, accountId]) =>
        this.matchService.deleteMatchResult(matchId, accountId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Deleted match result: ${matchId}, ${accountId}`, false),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly addPlayer = this.effect<string>((accountId$) => {
    return accountId$.pipe(
      switchMap((accountId) =>
        this.playerService.addPlayer(accountId).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added player: ${accountId}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchLeaderboard(),
          }),
        ),
      ),
    )
  })

  readonly fetchMaps = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        this.mapService.listMap().pipe(
          tapResponse({
            next: (maps) => this.patchState({ maps: maps.sort((mapA, mapB) => mapA.name.localeCompare(mapB.name)) }),
            error: (error: HttpErrorResponse) => this.logService.error(error),
          }),
        ),
      ),
    )
  })

  readonly addMap = this.effect<string>((mapUid$) => {
    return mapUid$.pipe(
      switchMap((mapUid) =>
        this.mapService.addMap(mapUid).pipe(
          tapResponse({
            next: () => this.logService.success('Success', `Added map: ${mapUid}`),
            error: (error: HttpErrorResponse) => this.logService.error(error),
            finalize: () => this.fetchMaps(),
          }),
        ),
      ),
    )
  })

  readonly updateNemesisWeights = this.updater((state, weights: StoreState['nemesisWeights']) => ({
    ...state,
    nemesisWeights: {
      ...state.nemesisWeights,
      ...weights,
    },
  }))
}
