import { Component, Input } from '@angular/core'
import { Match, MatchDecorated } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { StoreService } from 'src/services/store.service'

@Component({
  selector: 'match-bracket',
  template: `
    <div class="weekly-matches">
      <ng-container *ngFor="let match of matches">
        <top-card
          label="{{ match.type | titlecase }} {{ match.instance | uppercase }}"
          [tops]="match.results"
          [showMorePlayers]="true"
          [editable]="editable"
          [players]="players"
          (addedMatchResult)="addMatchResult(match, $event)"
          (updatedMatchResult)="updateMatchResult(match, $event)"
          (deleteMatchResult)="deleteMatchResult(match, $event)"
        ></top-card>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .weekly-matches {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(4, 268px);
        grid-column-gap: 24px;
        grid-row-gap: 24px;
      }
      
      @media (max-width: 1268px) {
        .weekly-matches {
          grid-template-columns: repeat(2, 268px);
        }
      }
      
      @media (max-width: 624px) {
        .weekly-matches {
          grid-template-columns: repeat(1, 268px);
        }
      }
    `,
  ],
})
export class MatchBracketComponent {
  @Input() matches!: Array<MatchDecorated>
  @Input() players: Array<Player> = []
  @Input() editable = false

  constructor(public storeService: StoreService) {}

  addMatchResult(match: Match, player?: Player) {
    if (!player) return
    this.storeService.addMatchResult([match.matchId, player.accountId])
  }

  updateMatchResult(match: Match, { player, score }: { player: Player, score: number }) {
    this.storeService.updateMatchResult([match.matchId, player.accountId, score])
  }

  deleteMatchResult(match: Match, player: Player) {
    this.storeService.deleteMatchResult([match.matchId, player.accountId])
  }
}
