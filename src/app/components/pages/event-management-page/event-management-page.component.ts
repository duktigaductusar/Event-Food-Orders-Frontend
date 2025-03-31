import { Component } from '@angular/core';
import { EventManagementFormComponent } from "../../features/event-management-form/event-management-form.component";
import { MainLayoutComponent } from '@app/components/layouts';

@Component({
  selector: 'app-event-management-page',
  imports: [MainLayoutComponent, EventManagementFormComponent],
  templateUrl: './event-management-page.component.html',
  styleUrl: './event-management-page.component.css'
})
export class EventManagementPageComponent {

}
