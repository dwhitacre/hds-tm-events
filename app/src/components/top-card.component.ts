import { Component, Input } from '@angular/core'
import { Top } from 'src/domain/leaderboard'
import { MatchResult } from 'src/domain/match'
import { Player } from 'src/domain/player'
import { WeeklyResult } from 'src/domain/weekly'

@Component({
  selector: 'top-card',
  template: `
    <div *ngIf="label" class="label">{{ label }}</div>
    <p-card [style]="{ width: '268px' }">
      <ng-template *ngIf="displayImage" pTemplate="header">
        <img *ngIf="tops.length > 0; else noPlayerImg"
          [alt]="tops[0].player.name"
          [src]="tops[0].player.image || 'assets/images/hds-events-nobg.png'"
          height="192"
        />
      </ng-template>
      <ng-template pTemplate="content">
        <div *ngIf="tops.length > 0; else bye" class="player-content">
          <span class="position"> {{ tops[0].position || 1 | position }}</span>
          <span class="name">{{ tops[0].player.name }}</span>
          <span class="score">{{ tops[0].score || 0 }}</span>
        </div>
      </ng-template>
    </p-card>
    <div class="footer" *ngIf="showMorePlayers">
      <div *ngIf="tops.length > 1; else bye" class="player-content player2">
        <span class="position"> {{ tops[1].position || 2 | position }}</span>
        <span class="name">{{ tops[1].player.name }}</span>
        <span class="score">{{ tops[1].score || 0 }}</span>
      </div>
    </div>
    
    <ng-template #noPlayerImg>
      <img
        alt="No player"
        src="assets/images/hds-events-nobg.png"
        height="192"
      />
    </ng-template>

    <ng-template #bye>
      <div class="player-content bye">
        <ng-container *ngIf="!editable; else byeedit">
          <span>bye</span>
        </ng-container>
      </div>
    </ng-template>

    <ng-template #byeedit>
      <p-inplace closable="closable" (onDeactivate)="updateMatchResult($event)">
        <ng-template pTemplate="display">
          <span>bye</span>
        </ng-template>
        <ng-template pTemplate="content">
          <p-dropdown
            [options]="players" 
            optionLabel="name"
          />
        </ng-template>
      </p-inplace>
    </ng-template>
  `,
  styles: [
    `
      .label {
        font-size: 1.25rem;
        margin-bottom: 8px;
      }

      :host::ng-deep .p-card {
        border: 2px var(--surface-border) solid;
        border-radius: 4px;
      }

      :host::ng-deep .p-card-body, .footer {
        padding: 8px 16px;
        background-color: var(--primary-color);
        color: var(--primary-color-text);
        font-weight: 700;
      }

      .player-content {
        display: flex;
        gap: 2px;
        justify-content: space-between;
      }

      .footer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border: 2px var(--surface-border) solid;
        border-top: 1px;
        border-radius: 0px 0px 4px 4px;
      }
      
      .bye {
        font-style: italic;
        justify-content: center;
      }
    `,
  ],
})
export class TopCardComponent {
  @Input() displayImage = true
  @Input() label?: string
  @Input() showMorePlayers = false
  @Input() tops!: Array<Top | WeeklyResult | MatchResult>
  @Input() editable = false
  @Input() players: Array<Player> = []

  updateMatchResult(event: Event) {
    console.log(event)
  }
}
