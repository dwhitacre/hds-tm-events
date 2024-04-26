import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { tapResponse } from "@ngrx/operators";
import { switchMap } from "rxjs";
import { Leaderboard } from "src/domain/leaderboard";
import { LeaderboardService } from "src/services/leaderboard.service";
import { LogService } from "src/services/log.service";

export interface Standings {
  leaderboard: Leaderboard,
  loading: boolean
}

@Injectable()
export class StandingsStore extends ComponentStore<Standings> {
  #leaderboardUid = "standings"

  readonly leaderboard$ = this.select(state => state.leaderboard)
  readonly loading$ = this.select(state => state.loading)

  constructor(private leaderboardService: LeaderboardService, private logService: LogService) {
    super({
      leaderboard: {
        tops: null,
        playercount: 0,
      },
      loading: true
    })

    this.fetchLeaderboard()
  }

  readonly fetchLeaderboard = this.effect<void>(trigger$ => {
    return trigger$.pipe(
      switchMap(() => this.leaderboardService.getLeaderboard(this.#leaderboardUid).pipe(
        tapResponse({
          next: (leaderboard) => this.patchState({ leaderboard }),
          error: (error: HttpErrorResponse) => this.logService.error(error),
          finalize: () => this.patchState({ loading: false })
        })
      ))
    )
  }) 
}