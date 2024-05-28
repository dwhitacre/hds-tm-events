import { Component, Input, Output, EventEmitter } from '@angular/core'
import { Top } from 'src/domain/leaderboard'
import { MatchResult } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'top-card-player',
  template: `
    <div *ngIf="!isBye; else bye" class="player-content">
      <span class="position"> {{ top.position || defaultPosition | position }}</span>
      <span class="name">{{ top.player.name }}</span>
      <span class="score">{{ top.score || 0 }}</span>
    </div>

    <ng-template #bye>
      <div class="player-content bye">
        <ng-container *ngIf="!editable; else byeedit">
          <span>bye</span>
        </ng-container>
      </div>
    </ng-template>

    <ng-template #byeedit>
      <p-inplace closeIcon="pi pi-check" closable="closable" (onDeactivate)="selected.emit(selectedPlayer)">
        <ng-template pTemplate="display">
          <span>bye</span>
        </ng-template>
        <ng-template pTemplate="content">
          <p-dropdown
            [options]="players" 
            optionLabel="name"
            [(ngModel)]="selectedPlayer"
          />
        </ng-template>
      </p-inplace>
    </ng-template>
  `,
  styles: [
    `
      .player-content {
        display: flex;
        gap: 2px;
        justify-content: space-between;
      }
      
      .bye {
        font-style: italic;
        justify-content: center;
      }
    `,
  ],
})
export class TopCardPlayerComponent {
  @Input() isBye = false
  @Input() top!: Top | WeeklyResult | MatchResult
  @Input() defaultPosition = 0
  @Input() players: Array<Player> = []
  @Input() editable = false

  selectedPlayer?: Player

  @Output() selected = new EventEmitter<Player | undefined>()
}
