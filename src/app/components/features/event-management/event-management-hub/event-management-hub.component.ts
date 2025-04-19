import { CommonModule } from "@angular/common";
import {
	Component,
	computed,
	inject,
	OnInit,
	signal,
	Signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
	CustomUlComponent,
	GenericBtnComponent,
	ResponsiveLiComponent,
} from "@app/components/html";
import {
	DatetimelabelComponent,
	SpinnerComponent,
	StatusLabelComponent,
} from "@app/components/shared";
import {
	IEventDetailDto,
	IEventDetailInfoDto,
	IEventDetailOwnerDto,
	IEventDto,
	ILabelType,
	IParticipantWithUserDto,
	IUserDto,
} from "@app/models";
import {
	AuthService,
	EventService,
	EventStateService,
	ParticipantService,
	UserService,
} from "@app/services";

import { fromDateTimeISOString } from "@app/utility";
import { appRoutes, appRoutesPara } from "@app/constants";
import { AppBaseComponent } from "@app/components/base";
import { ResponsiveDivComponent } from "@app/components/html";

import { EditEventComponent } from "../edit-event/edit-event.component";
import { EventManagementDeleteModalComponentComponent } from "../event-management-delete-modal-component/event-management-delete-modal.component";

@Component({
	selector: "app-event-management-hub",
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		GenericBtnComponent,
		EditEventComponent,
		CommonModule,
		ResponsiveDivComponent,
		SpinnerComponent,
		ResponsiveLiComponent,
		CustomUlComponent,
	],
	templateUrl: "./event-management-hub.component.html",
	styleUrl: "./event-management-hub.component.css",
})
export class EventManagementHubComponent
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
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly authService: AuthService,
		public readonly eventService: EventService,
		public readonly eventStateService: EventStateService,
		public readonly participantService: ParticipantService,
		public readonly userService: UserService
	) {
		super();
		this.selectedEventDto = computed(() =>
			this.eventStateService.selectedEventDto()
		);
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const eventId = params.get(appRoutesPara.eventId);
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

	get listItems() {
		return [
			this.t2("event-management.participantsHaveResponded", {
				answeredCount: this.getConfirmedParticipants(),
				totalCount: this.participants.length,
			}),
			this.t2("event-management.participantsWantsMealResponded", {
				wantsMealCount: this.getWithFoodParticipants(),
			}),
		];
	}

	getConfirmedParticipants(): number {
		return (
			this.participants.length -
			this.participants.filter(p => p.responseType === "PENDING").length
		);
	}

	getWithFoodParticipants(): number {
		return (
			this.participants.length -
			this.participants.filter(
				p => p.responseType !== "ATTENDING_OFFICE" || !p.wantsMeal
			).length
		);
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
			endTime: this.eventDetailDto?.endTime,
			users: this.users,
		};
	}

	getDateFromStringValue(date: string) {
		return fromDateTimeISOString(date);
	}

	getOptionalDateFromStringValue(date?: string) {
		if (date == null) {
			return;
		}
		return fromDateTimeISOString(date);
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

	createLabelTypeFromUserDto(userDto: IUserDto): ILabelType {
		const p = this.participants.find(p => p.userId == userDto.userId);

		if (p == null) {
			return {
				responseType: "PENDING",
				isOwner: false,
				wantsMeal: false,
			};
		}

		return {
			responseType: p.responseType,
			isOwner: this.isOwnerByParticipantDto(p),
			wantsMeal: p.wantsMeal,
		};
	}

	isOwnerByParticipantDto(p: IParticipantWithUserDto | undefined) {
		return p?.userId === this.authService.getActiveAccountUserId();
	}

	isOwnerByUserDto(u: IUserDto) {
		return u.userId === this.authService.getActiveAccountUserId();
	}
}
