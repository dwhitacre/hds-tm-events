import { Component, Input } from '@angular/core';
import { Player } from 'src/domain/player';

@Component({
    selector: 'player-row',
    template: `
      <div>
        <span class="position">{{position}}</span>
        <span class="name">{{player.name}}</span>
        <span>{{score}}</span>
      </div>
    `,
    styles: [`
      div {
        display: flex;
        gap: 12px;
        justify-content: flex-start;
      }

      .position {
        flex-grow: 1;
      }

      .name {
        flex-grow: 3;
      }
    `]
})
export class PlayerRowComponent {
  @Input() player!: Player
  @Input() position!: number
  @Input() score!: number
}
