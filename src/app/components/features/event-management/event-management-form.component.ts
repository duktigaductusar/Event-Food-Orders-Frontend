import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBaseComponent } from '@app/components/base/app-base.component';
import { GenericBtnComponent } from '@app/components/html';
import { DatetimelabelComponent, StatusLabelComponent } from '@app/components/shared';
import { IEventDto, IParticipantForResponseDto, IUserDto } from '@app/models';
import { IEventDetailDto } from '@app/models/IEventDetailDto.model';
import { EventService, UserService } from '@app/services';
import { ParticipantService } from '@app/services/participant/participant.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventManagementDeleteModalComponentComponent } from './event-management-delete-modal-component/event-management-delete-modal-component.component';

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
  users: IUserDto[] = [];

	isPending = signal(false);
//todo fetch this from MSAL library
	userId = "77d7e9a1-baff-493f-b9f4-9497a07b94fc"
	private modalService = inject(NgbModal);

  constructor(
    private router: Router,
    public eventService: EventService,
    public participantService: ParticipantService,
    public userService: UserService
  ) {
    super();
    this.selectedEventDto = signal(this.eventService.selectedEventDto());
  }

  ngOnInit(): void {
    this.loadEventDetailDto();
  }

	loadEventDetailDto(): void {
		const currentEventId = this.selectedEventDto()?.id
		if (currentEventId == null) {
			return
		}
		this.isPending.set(true);
		this.eventService.getDetailEvent(currentEventId, this.userId).subscribe({
			next: item => {
        this.loadParticipantDtos(item);
				this.eventDetailDto = item;
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
	}

  loadParticipantDtos(eventDto: IEventDetailDto): void {
    const currentEventId = eventDto.id
		if (currentEventId == null) {
			return
		}
		this.isPending.set(true);
		this.participantService.getParticipantsInEvent(currentEventId, this.userId).subscribe({
			next: item => {
				this.participants = item;
        this.loadUserDtos(item);
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
  }

  loadUserDtos(participantDtos: IParticipantForResponseDto[]): void {
    const currentEventId = this.selectedEventDto()?.id
		if (currentEventId == null) {
			return
		}
    const currentParticipantIds = participantDtos.map(p => p.userId);
		this.isPending.set(true);
    this.userService.getUsersFromId(currentParticipantIds).subscribe({
      next: item => {
        this.users = item;
      },
      error: error => console.error("Test error" + error),
      complete: () => this.isPending.set(false),
    });
  };

  deleteEventAssert(): void {
    if (this.eventDetailDto === null || this.eventDetailDto === undefined) {
      return;
    }
    this.openDeleteModal(this.eventDetailDto);
  }

  deleteEvent(): void {
    if (this.eventDetailDto === null || this.eventDetailDto === undefined) {
      return;
    }
    this.isPending.set(true);
    this.eventService.deleteEvent(this.eventDetailDto.id).subscribe({
      next: item => {
        console.log("Delete item: ", item);
      },
      error: error => console.log("Test error ", error),
      complete: () => this.isPending.set(false)
    });
  }

  openDeleteModal(event: IEventDetailDto) {
      const modalRef = this.modalService.open(EventManagementDeleteModalComponentComponent, {
        container: 'body',
        backdrop: true,
        centered: true,
        backdropClass: "app-modal-custom"
      })
      modalRef.componentInstance.event = event;
    }
}
