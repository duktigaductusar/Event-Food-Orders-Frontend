import {
	Component,
	computed,
	OnInit,
	Signal,
	signal,
	OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, Subject, takeUntil } from "rxjs";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";

import type { ParticipantResponseType } from "@types";
import {
	IEventDetailDto,
	IEventDto,
	IParticipantForUpdateDto,
} from "@app/models";
import { EventService, EventStateService } from "@app/services";
import { fromDateTimeISOString, getShortTitle } from "@app/utility";
import { ParticipantService } from "@app/services";
import { appRoutes, appRoutesPara } from "@app/constants";
import {
	DatetimelabelComponent,
	SpinnerComponent,
	StatusLabelComponent,
} from "@app/components/shared";
import { AppBaseComponent } from "@app/components/base";
import { ResponsiveFormComponent } from "@app/components/html";

import { IParticipantResponseForm } from "../interfaces";
import { eventResponseControllerNames } from "../constants";

@Component({
	selector: "app-event-detail-item",
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		ResponsiveFormComponent,
		ReactiveFormsModule,
		SpinnerComponent,
	],
	templateUrl: "./event-detail-item.component.html",
	styleUrl: "./event-detail-item.component.css",
})
export class EventDetailItemComponent
	extends AppBaseComponent
	implements OnInit, OnDestroy
{
	private destroy = new Subject<void>();
	eventResponseControllerNames = eventResponseControllerNames;
	eventForm: FormGroup<IParticipantResponseForm>;
	selectedEventDto: Signal<IEventDto | null>;
	isAttendingAtOffice: Signal<boolean> | undefined;
	eventDetailDto: IEventDetailDto | null = null;
	responseTypes: { id: ParticipantResponseType; label: string }[] = [
		{ id: "PENDING", label: this.t("event-response.pendingReponseLabel") },
		{
			id: "ATTENDING_ONLINE",
			label: this.t("event-response.attendingOnlineReponseLabel"),
		},
		{
			id: "ATTENDING_OFFICE",
			label: this.t("event-response.attendingOfficeReponseLabel"),
		},
		{
			id: "NOT_ATTENDING",
			label: this.t("event-response.notAttendingReponseLabel"),
		},
	] as const;
	isPending = signal(false);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public eventService: EventService,
		public eventStateService: EventStateService,
		private participantService: ParticipantService,
		private fb: FormBuilder
	) {
		super();
		this.selectedEventDto = computed(() =>
			this.eventStateService.selectedEventDto()
		);
		this.eventForm = this.fb.nonNullable.group({
			preferences: fb.nonNullable.control("", [
				Validators.maxLength(1000),
			]),
			allergies: fb.nonNullable.control("", [Validators.maxLength(1000)]),
			wantsMeal: fb.nonNullable.control(false, [Validators.required]),
			responseType: fb.nonNullable.control(
				"PENDING" as ParticipantResponseType,
				[Validators.required]
			),
		});

		this.eventForm
			.get(eventResponseControllerNames.responseType)
			?.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe(value => {
				this.eventForm.patchValue(
					{
						wantsMeal: value === "ATTENDING_OFFICE",
					},
					{ emitEvent: false }
				);
			});

		this.eventForm
			.get(eventResponseControllerNames.responseType)
			?.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe(() => {
				this.clearFields();
			});
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const eventId = params.get(appRoutesPara.eventId);
			if (eventId) {
				this.loadEventDetailDto(eventId);
			}
		});
	}

	loadEventDetailDto(eventId: string): void {
		this.isPending.set(true);
		this.eventService
			.getDetailEvent(eventId)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: item => {
					this.eventDetailDto = item;
					this.eventStateService.selectedEventDto.set(item);
					this.initFields();
					this.initIsAttendingAtOffice();
				},
				error: error => {
					console.error("Test error" + error);
					this.router.navigate([appRoutes.HOME]);
				},
			});
	}

	getShortTitle(title: string): string {
		return getShortTitle(title);
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

	clearFields(): void {
		this.eventForm.patchValue({
			preferences: this.eventDetailDto?.preferences ?? "",
			allergies: this.eventDetailDto?.allergies ?? "",
		});
		this.setIsAttendingAtOffice();
	}

	onSubmit = () => {
		const currentParticipantId = this.eventDetailDto?.participantId;
		if (currentParticipantId == null) {
			return;
		}

		if (this.eventForm.valid) {
			const dto: IParticipantForUpdateDto = {
				responseType: this.eventForm.getRawValue().responseType,
				wantsMeal: this.eventForm.getRawValue().wantsMeal,
				allergies: this.eventForm.getRawValue().allergies,
				preferences: this.eventForm.getRawValue().preferences,
			};

			console.log("dto: ", dto);

			this.isPending.set(true);
			this.participantService
				.respondToEvent(dto, currentParticipantId)
				.pipe(finalize(() => this.isPending.set(false)))
				.subscribe({
					next: response => {
						console.log(response);
					},
					error: error => {
						console.error("Error fetching users:", error);
					},
					complete: () => {
						this.router.navigate([appRoutes.HOME]);
					},
				});
		}
	};

	initFields(): void {
		this.eventForm.setValue({
			preferences: this.eventDetailDto?.preferences ?? "",
			allergies: this.eventDetailDto?.allergies ?? "",
			wantsMeal: this.eventDetailDto?.wantsMeal ?? true,
			responseType: this.eventDetailDto?.responseType ?? "PENDING",
		});
	}

	initIsAttendingAtOffice(): void {
		this.isAttendingAtOffice = computed(
			() => this.eventDetailDto?.responseType == "ATTENDING_OFFICE"
		);
	}

	setIsAttendingAtOffice(): void {
		this.isAttendingAtOffice = computed(
			() => this.eventForm.value.responseType === "ATTENDING_OFFICE"
		);
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
