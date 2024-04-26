import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampaignService } from 'src/services/campaign.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [],
  providers: [CampaignService],
})
export class AppComponent {
  title = 'app';
}
