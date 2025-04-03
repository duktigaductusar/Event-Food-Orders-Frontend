import {
	Component,
	computed,
	inject,
	OnInit,
	signal,
	Signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { GenericBtnComponent } from "@app/components/html";
import {
	DatetimelabelComponent,
	StatusLabelComponent,
} from "@app/components/shared";
import {
	IEventDetailOwnerDto,
	IEventDto,
	IParticipantForResponseDto,
	IUserDto,
} from "@app/models";
import { IEventDetailDto } from "@app/models/eventDtos/IEventDetailDto.model";
import { EventService, UserService } from "@app/services";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EventManagementDeleteModalComponentComponent } from "./event-management-delete-modal-component/event-management-delete-modal-component.component";
import { EditEventComponent } from "./edit-event/edit-event.component";
import { ResponsiveFormComponent } from "../../html/responsive-form/responsive-form.component";
import { CommonModule } from "@angular/common";
import { fromDateTimeISOString } from "@app/utility";
import { appRoutes } from "@app/constants";
import { ParticipantService } from "@app/services/participant/participant.service";

@Component({
	selector: "app-event-management-form",
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		GenericBtnComponent,
		EditEventComponent,
		ResponsiveFormComponent,
		CommonModule,
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
	userId = "a84c12d5-9075-42d2-b467-6b345b7d8c9f";
	private modalService = inject(NgbModal);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public eventService: EventService,
		public participantService: ParticipantService,
		public userService: UserService
	) {
		super();
		this.selectedEventDto = computed(() =>
			this.eventService.selectedEventDto()
		);
	}

	ngOnInit(): void {
		if (this.selectedEventDto() != null) {
			this.loadEventDetailDto(this.selectedEventDto()?.id);
		}

		this.route.paramMap.subscribe(params => {
			const eventId = params.get("id");
			if (eventId) {
				this.loadEventDetailDto(eventId);
			}
		});
	}

	loadEventDetailDto(currentEventId?: string): void {
		if (currentEventId == null) {
			return;
		}

		this.isPending.set(true);
		this.eventService
			.getDetailEvent(currentEventId, this.userId)
			.subscribe({
				next: item => {
					this.eventDetailDto = item;
					this.eventService.selectedEventDto.set(item);
					this.loadParticipantDtos(item);
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

	registerToEvent() {
		this.eventService.setSelectedEvent(this.selectedEventDto()!);
		this.router.navigate([
			`/${appRoutes.EVENT_DETAILS}`,
			this.selectedEventDto()!.id,
		]);
	}

	deleteEventAssert(): void {
		if (this.eventDetailDto === null || this.eventDetailDto === undefined) {
			return;
		}
		this.openDeleteModal(this.eventDetailDto);
	}

	toggleEdit() {
		console.log("created real: ", this.createEventDetailOwnerDto());
		this.edit.update(prev => !prev);
		if (!this.edit()) {
			this.loadEventDetailDto(this.selectedEventDto()?.id);
		}
	}

	createEventDetailOwnerDto(): Partial<IEventDetailOwnerDto> {
		return {
			title: this.eventDetailDto?.title,
			description: this.eventDetailDto?.description,
			date: this.eventDetailDto?.date,
			deadline: this.eventDetailDto?.deadline,
			users: this.users,
		};
	}

	fromDateTimeISOStringForEventDto() {
		return fromDateTimeISOString(this.selectedEventDto()!.date);
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
			complete: () => {
				this.navigateToHome();
				this.isPending.set(false);
			},
		});
	}

	navigateToHome() {
		this.router.navigate([`/${appRoutes.HOME}`]);
	}
}
