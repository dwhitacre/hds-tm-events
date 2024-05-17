import { Component, Input, ViewChild } from '@angular/core'
import { StorageService } from 'src/services/storage.service'

@Component({
  selector: 'topbar',
  template: `
    <div class="layout-topbar">
      <a class="layout-topbar-logo">
        <img src="assets/images/hds-events-nobg.png" alt="logo" height="32" />
        <span class="layout-topbar-title">HD Weekly League</span>
      </a>
      <div class="layout-topbar-menu">
        <p-button
          icon="pi pi-discord"
          [text]="true"
          label="Join"
          iconPos="right"
          (onClick)="openDiscord()"
        ></p-button>
        <p-menu #menu [model]="settings" [popup]="true" [appendTo]="menubutton"/>
        <p-button #menubutton (click)="menu.toggle($event)" icon="pi pi-cog" [text]="true"/>
      </div>
    </div>
    <p-dialog
      header="Enter Admin Key" 
      [modal]="true"
      [(visible)]="adminkeyVisible"
      position="topright"
      [draggable]="false"
      [style]="{ width: '25rem' }">
      <div class="layout-dialog-input">
        <input pInputText #adminkey type="password" autocomplete="off" />
      </div>
      <div class="layout-dialog-actions">
        <p-button label="Cancel" severity="secondary" (click)="adminkeyVisible = false" />
        <p-button label="Save" (click)="saveAdminKey(adminkey.value)" />
      </div>
    </p-dialog>
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
        gap: 2px;
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

      .layout-topbar-title {
        margin-left: 12px;
      }

      a {
        text-decoration: none;
      }

      .layout-dialog-input {
        display: flex;
        align-items: center;
        gap: 3rem;
        margin-bottom: 1rem;
      }

      .layout-dialog-input input {
        width: 100%;
      }

      .layout-dialog-actions {
        display: flex;
        justify-content: end;
        gap: 12px;
      }

      :host::ng-deep .p-menu {
        top: 52px !important;
      }
    `,
  ],
})
export class TopBarComponent {
  adminkeyVisible = false
  @ViewChild('#adminkey') adminkeyInput!: Input

  settings = [
    {
      label: 'Github',
      icon: 'pi pi-github',
      command: this.openGithub
    },
    {
      label: 'Enter Admin Key',
      icon: 'pi pi-lock',
      command: () => this.adminkeyVisible = true
    }
  ]

  constructor(private storageService: StorageService) {}

  openGithub() {
    window.open('https://github.com/dwhitacre/hds-tm-events')
  }

  saveAdminKey(value: string) {
    this.storageService.saveAdminKey(value)
    this.adminkeyVisible = false
  }

  openDiscord() {
    window.open('https://discord.gg/yR5EtqAWW7')
  }
}
