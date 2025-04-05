// todo: this service uses state
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
	SpinnerComponent,
	StatusLabelComponent,
} from "@app/components/shared";
import {
	IEventDetailOwnerDto,
	IEventDto,
	IParticipantForResponseDto,
	IUserDto,
} from "@app/models";
import { IEventDetailDto } from "@app/models/eventDtos/IEventDetailDto.model";
import { EventService, EventStateService, UserService } from "@app/services";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EventManagementDeleteModalComponentComponent } from "./event-management-delete-modal-component/event-management-delete-modal-component.component";
import { EditEventComponent } from "./edit-event/edit-event.component";
import { ResponsiveFormComponent } from "../../html/responsive-form/responsive-form.component";
import { CommonModule } from "@angular/common";
import { fromDateTimeISOString } from "@app/utility";
import { appRoutes } from "@app/constants";
import { ParticipantService } from "@app/services/api/participant.service";
import { IEventDetailInfoDto } from "@app/models/eventDtos/IEventDetailInfoDto.model";
import { IParticipantWithUserDto } from "@app/models/participantDtos/IParticipantWithUserDto.model";
import { finalize } from "rxjs";
import { ResponsiveDivComponent } from "@app/components/html/responsive-div.component/responsive-div.component";

@Component({
	selector: "app-event-management-form",
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		GenericBtnComponent,
		EditEventComponent,
		CommonModule,
		ResponsiveDivComponent,
		SpinnerComponent,
	],
	templateUrl: "./event-management-form.component.html",
	styleUrl: "./event-management-form.component.css",
})
export class EventManagementFormComponent
	extends AppBaseComponent
	implements OnInit
{
	selectedEventDto: Signal<IEventDto | null>;
	eventDetailDto: IEventDetailInfoDto | null = null;
	participants: IParticipantWithUserDto[] = [];
	users: IUserDto[] = [];
	isPending = signal(false);
	even = signal(false);

	private modalService = inject(NgbModal);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public eventService: EventService,
		public eventStateService: EventStateService,
		public participantService: ParticipantService,
		public userService: UserService
	) {
		super();
		this.selectedEventDto = computed(() =>
			this.eventStateService.selectedEventDto()
		);
	}

	ngOnInit(): void {
		// TODO look into removing these following three lines
		// if (this.selectedEventDto() != null) {
		// 	this.loadEventDetailInfoDto(this.selectedEventDto()?.id);
		// }

		this.route.paramMap.subscribe(params => {
			const eventId = params.get("id");
			if (eventId) {
				this.loadEventDetailInfoDto(eventId);
			}
		});
	}

	loadEventDetailInfoDto(currentEventId?: string): void {
		if (currentEventId == null) {
			return;
		}

		this.isPending.set(true);
		this.eventService
			.getDetailInfoEvent(currentEventId)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: item => {
					this.eventDetailDto = item;
					this.eventStateService.selectedEventDto.set(item);
					this.participants = item.participants;
					this.setUsers();
				},
				error: error => console.error("Test error" + error),
			});
	}

	setUsers() {
		this.participants.forEach(p => {
			this.users.push({
				userId: p.userId,
				username: p.userName,
				email: p.email,
			});
		});
	}

	registerToEvent() {
		this.eventStateService.setSelectedEvent(this.selectedEventDto()!);
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
		this.eventStateService.toggleEditEvent(() => {
			if (!this.eventStateService.editEvent()) {
				this.loadEventDetailInfoDto(this.selectedEventDto()?.id);
			}
		});
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
		this.eventService
			.deleteEvent(this.eventDetailDto.id)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: item => {
					console.log("Delete item: ", item);
				},
				error: error => {
					console.log("Test error ", error);
				},
				complete: () => {
					this.navigateToHome();
				},
			});
	}

	navigateToHome() {
		this.router.navigate([`/${appRoutes.HOME}`]);
	}
}
