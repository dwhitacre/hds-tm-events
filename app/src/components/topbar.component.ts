import { Component } from '@angular/core'

@Component({
  selector: 'topbar',
  template: `
    <div class="layout-topbar">
      <a class="layout-topbar-logo" routerLink="">
        <img src="assets/images/hds-events-nobg.png" alt="logo" height="32" />
        <span>HD Weekly League</span>
      </a>
      <div class="layout-topbar-menu">
        <p-button
          icon="pi pi-discord"
          [text]="true"
          (onClick)="openDiscord()"
        ></p-button>
      </div>
    </div>
  `,
  styles: [
    `
      .layout-topbar {
        position: fixed;
        height: 4rem;
        z-index: 997;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0 2rem;
        transition: left 0.2s;
        display: flex;
        align-items: center;
        box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
        border-bottom: 1px solid var(--surface-border);
        background-color: var(--surface-card);
      }

      .layout-topbar .layout-topbar-logo {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        width: 250px;
        border-radius: 12px;
      }

      .layout-topbar .layout-topbar-menu {
        margin: 0 0 0 auto;
        padding: 0;
        list-style: none;
        display: flex;
        gap: 4px;
      }

      .layout-topbar .layout-topbar-menu .layout-topbar-button {
        margin-left: 1rem;
      }

      .layout-topbar .layout-topbar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        color: var(--text-color-secondary);
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      span {
        margin-left: 12px;
      }

      a {
        text-decoration: none;
      }
    `,
  ],
})
export class TopBarComponent {
  openGithub() {
    window.open('https://github.com/dwhitacre/hds-tm-events')
  }
  openDiscord() {
    window.open('https://discord.gg/yR5EtqAWW7')
  }
}
