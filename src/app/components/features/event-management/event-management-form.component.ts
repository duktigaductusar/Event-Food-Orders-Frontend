import { Component, inject, OnInit, signal, Signal } from "@angular/core";
import { Router } from "@angular/router";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { GenericBtnComponent } from "@app/components/html";
import {
	DatetimelabelComponent,
	StatusLabelComponent,
} from "@app/components/shared";
import { IEventDetailOwnerDto, IEventDto, IParticipantForResponseDto, IUserDto } from "@app/models";
import { IEventDetailDto } from "@app/models/IEventDetailDto.model";
import { EventService, UserService } from "@app/services";
import { ParticipantService } from "@app/services/participant/participant.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EventManagementDeleteModalComponentComponent } from "./event-management-delete-modal-component/event-management-delete-modal-component.component";
import { EditEventComponent } from "./edit-event/edit-event.component";

@Component({
	selector: "app-event-management-form",
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		GenericBtnComponent,
		EditEventComponent
	],
	templateUrl: "./event-management-form.component.html",
	styleUrl: "./event-management-form.component.css",
})
export class EventManagementFormComponent
	extends AppBaseComponent
	implements OnInit
{
	edit = signal(false);
	selectedEventDto: Signal<IEventDto | null>;
	eventDetailDto: IEventDetailDto | null = null;

	participants: IParticipantForResponseDto[] = [];
	users: IUserDto[] = [];

	isPending = signal(false);
//todo fetch this from MSAL library
	userId = "a84c12d5-9075-42d2-b467-6b345b7d8c9f"
	private modalService = inject(NgbModal);
	
	// TODO Merge particpants and event detai dto
	mockEventDetailOwnerDto: IEventDetailOwnerDto = {
		date: "2025-03-31T10:12:00.000Z",
		deadline: "2025-03-31T10:12:00.000Z",
		description: "test event",
		endTime: null,
		title: "My Test Event",
		users: []
	}// ['8ef89f5a-c315-470c-9f52-2e6a06dd1197'] }

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

	toggleEdit() {
		this.edit.update(prev => !prev)
	}

	loadEventDetailDto(): void {
		const currentEventId = this.selectedEventDto()?.id;
		if (currentEventId == null) {
			return;
		}
		this.isPending.set(true);
		this.eventService
			.getDetailEvent(currentEventId, this.userId)
			.subscribe({
				next: item => {
					this.loadParticipantDtos(item);
					this.eventDetailDto = item;
				},
				error: error => console.error("Test error" + error),
				complete: () => this.isPending.set(false),
			});
	}

	loadParticipantDtos(eventDto: IEventDetailDto): void {
		const currentEventId = eventDto.id;
		if (currentEventId == null) {
			return;
		}
		this.isPending.set(true);
		this.participantService
			.getParticipantsInEvent(currentEventId, this.userId)
			.subscribe({
				next: item => {
					this.participants = item;
					this.loadUserDtos(item);
				},
				error: error => console.error("Test error" + error),
				complete: () => this.isPending.set(false),
			});
	}

	loadUserDtos(participantDtos: IParticipantForResponseDto[]): void {
		const currentEventId = this.selectedEventDto()?.id;
		if (currentEventId == null) {
			return;
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
	}

	deleteEventAssert(): void {
		if (this.eventDetailDto === null || this.eventDetailDto === undefined) {
			return;
		}
		this.openDeleteModal(this.eventDetailDto);
	}

	openDeleteModal(event: IEventDetailDto) {
		const modalRef = this.modalService.open(
			EventManagementDeleteModalComponentComponent,
			{
				container: "body",
				backdrop: true,
				centered: true,
				backdropClass: "app-modal-custom",
			}
		);
		modalRef.componentInstance.event = event;
		modalRef.componentInstance.manager = this;
	}

	deleteEvent(): void {
		console.log("Delete event in manager triggered");
		if (this.eventDetailDto === null || this.eventDetailDto === undefined) {
			return;
		}
		this.isPending.set(true);
		this.eventService.deleteEvent(this.eventDetailDto.id).subscribe({
			next: item => {
				console.log("Delete item: ", item);
			},
			error: error => console.log("Test error ", error),
			complete: () => this.isPending.set(false),
		});
	}
}
