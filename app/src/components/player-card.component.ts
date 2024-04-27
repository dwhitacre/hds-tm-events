import { Component, Input } from '@angular/core';
import { Player } from 'src/domain/player';

@Component({
    selector: 'player-card',
    template: `
      <p-card [style]="{ width: '268px'}">
        <ng-template pTemplate="header">
          <img alt="Card" [src]="player.image || 'assets/images/hds-events-nobg.png'" height="192" />
        </ng-template>
        <ng-template pTemplate="content">
          <div class="player-content">
            <span class="position">{{ position }}</span>
            <span class="name">{{ player.name }}</span>
            <span class="score">{{ score }}</span>
          </div>
        </ng-template>
      </p-card>
    `,
    styles: [`
      :host::ng-deep .p-card {
        border: 2px var(--surface-border) solid;
        border-radius: 0;
      }

      :host::ng-deep .p-card-body {
        padding: 8px 16px;
        background-color: var(--primary-color);
        color: var(--primary-color-text);
        font-weight: 700;
      }

      .player-content {
        display: flex;
        gap: 2px;
      }

      .position {
        flex-grow: 1;
      }

      .name {
        flex-grow: 3;
      }
    `]
})
export class PlayerCardComponent {
  @Input() player!: Player
  @Input() position!: number
  @Input() score!: number
}
