import { Component, OnInit, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBaseComponent } from '@app/components/base/app-base.component';
import { GenericBtnComponent } from '@app/components/html';
import { DatetimelabelComponent, StatusLabelComponent } from '@app/components/shared';
import { IEventDto } from '@app/models';
import { IEventDetailDto } from '@app/models/IEventDetailDto.model';
import { EventService } from '@app/services';

@Component({
  selector: 'app-event-management-form',
  imports: [
      DatetimelabelComponent,
      StatusLabelComponent,
      GenericBtnComponent],
  templateUrl: './event-management-form.component.html',
  styleUrl: './event-management-form.component.css'
})
export class EventManagementFormComponent
extends AppBaseComponent
implements OnInit
{
  selectedEventDto: Signal<IEventDto | null>;
	eventDetailDto: IEventDetailDto | null = null;

	isPending = signal(false);

  constructor(
    private router: Router,
    public eventService: EventService
  ) {
    super();
    this.selectedEventDto = signal(this.eventService.selectedEventDto());
  }

  ngOnInit(): void {
    this.loadEventDetailDto();
  }

	loadEventDetailDto(): void {
		this.isPending.set(true);
		this.eventService.getDetailEvent().subscribe({
			next: item => {
				this.eventDetailDto = item;
				console.log(item);
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
	}
}
