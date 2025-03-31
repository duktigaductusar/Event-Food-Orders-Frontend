import { Component, OnInit, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBaseComponent } from '@app/components/base/app-base.component';
import { GenericBtnComponent } from '@app/components/html';
import { DatetimelabelComponent, StatusLabelComponent } from '@app/components/shared';
import { IEventDto, IParticipantForResponseDto } from '@app/models';
import { IEventDetailDto } from '@app/models/IEventDetailDto.model';
import { EventService } from '@app/services';
import { ParticipantService } from '@app/services/participant/participant.service';

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

  participants: IParticipantForResponseDto[] = [];

	isPending = signal(false);

	userId = "9c4ab470-c98d-4297-99a6-93327de5c784"

  constructor(
    private router: Router,
    public eventService: EventService,
    public participantService: ParticipantService
  ) {
    super();
    this.selectedEventDto = signal(this.eventService.selectedEventDto());
  }

  ngOnInit(): void {
    this.loadEventDetailDto();
    this.loadParticipantDtos();
  }

	loadEventDetailDto(): void {
		const currentEventId = this.selectedEventDto()?.id
		if (currentEventId == null) {
			return
		}
		this.isPending.set(true);
		this.eventService.getDetailEvent(currentEventId, this.userId).subscribe({
			next: item => {
				this.eventDetailDto = item;
				console.log(item);
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
	}

  loadParticipantDtos(): void {
    const currentEventId = this.selectedEventDto()?.id
		if (currentEventId == null) {
			return
		}
		this.isPending.set(true);
		this.participantService.getParticipantsInEvent(currentEventId, this.userId).subscribe({
			next: item => {
				this.participants = item;
				console.log(item);
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
  }
}
