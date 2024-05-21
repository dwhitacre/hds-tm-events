import { Component, Input } from '@angular/core'
import { Player } from 'src/domain/player'

@Component({
  selector: 'player-card',
  template: `
    <div *ngIf="label" class="label">{{ label }}</div>
    <p-card [style]="{ width: '268px' }">
      <ng-template *ngIf="displayImage" pTemplate="header">
        <img
          [alt]="player.name"
          [src]="player.image || 'assets/images/hds-events-nobg.png'"
          height="192"
        />
      </ng-template>
      <ng-template pTemplate="content">
        <div class="player-content">
          <span class="position"> {{ position | position }}</span>
          <span class="name">{{ player.name }}</span>
          <span class="score">{{ score }}</span>
        </div>
      </ng-template>
    </p-card>
    <div class="footer" *ngIf="player2Enabled">
      <div *ngIf="!!player2; else bye" class="player-content player2">
        <span class="position"> {{ position2 | position }}</span>
        <span class="name">{{ player2.name }}</span>
        <span class="score">{{ score2 }}</span>
      </div>
      <ng-template #bye>
        <div class="player-content bye">
          bye
        </div>
      </ng-template>
    </div>
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
export class PlayerCardComponent {
  @Input() player!: Player
  @Input() position!: number
  @Input() score!: number
  @Input() displayImage = true
  @Input() label?: string

  @Input() player2Enabled = false
  @Input() player2?: Player
  @Input() position2!: number
  @Input() score2?: number
}
