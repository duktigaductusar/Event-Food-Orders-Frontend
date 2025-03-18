import { Component } from '@angular/core';
import { AppBaseComponent } from '@app/components/base/app-base.component';
import { EventListComponent } from '@app/components/features';



@Component({
  selector: 'app-home-page',
  imports: [EventListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent extends AppBaseComponent {

}
