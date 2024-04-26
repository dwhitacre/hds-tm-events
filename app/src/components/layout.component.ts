import { Component } from "@angular/core";

@Component({
  selector: 'layout',
  template: `
    <div class="layout-wrapper">
      <topbar></topbar>
      <div class="layout-main-container">
        <div class="layout-main">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    div {
      color: var(--primary-500);
    }

    .layout-wrapper {
      min-height: 98vh;
      margin-left: 0;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    .layout-main-container {
      display: flex;
      min-height: 98vh;
      flex-direction: column;
      justify-content: space-between;
      padding-top: 6rem;
    }

    .layout-main {
      flex: 1 1 auto;
    }
  `]
})
export class LayoutComponent {}