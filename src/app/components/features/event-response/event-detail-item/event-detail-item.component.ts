import { Component, computed, OnInit, Signal, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { EventService } from "@app/services";
import { DatetimelabelComponent } from "../../../shared/datetimelabel/datetimelabel.component";
import { IEventDto, IParticipantForUpdateDto } from "@app/models";
import { StatusLabelComponent } from "../../../shared/status-label/status-label.component";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { IEventDetailDto } from "@app/models/eventDtos/IEventDetailDto.model";
import { IParticipantResponseForm } from "../interfaces";
import type { ParticipantResponseType } from "@types";

import { fromDateTimeISOString } from "@app/utility";
import { ParticipantService } from "@app/services/participant/participant.service";

@Component({
	selector: "app-event-detail-item",
	imports: [
		DatetimelabelComponent,
		StatusLabelComponent,
		ResponsiveFormComponent,
		ReactiveFormsModule,
	],
	templateUrl: "./event-detail-item.component.html",
	styleUrl: "./event-detail-item.component.css",
})
export class EventDetailItemComponent
	extends AppBaseComponent
	implements OnInit
{
	eventForm: FormGroup<IParticipantResponseForm>;
	selectedEventDto: Signal<IEventDto | null>;
	isAttendingAtOffice: Signal<boolean> | undefined;

	eventDetailDto: IEventDetailDto | null = null;

	responseTypes: { id: ParticipantResponseType; label: string }[] = [
		{ id: "PENDING", label: "Avvaktar" },
		{ id: "ATTENDING_ONLINE", label: "Online" },
		{ id: "ATTENDING_OFFICE", label: "På plats" },
		{ id: "NOT_ATTENDING", label: "Avvisa" },
	] as const;

	isPending = signal(false);

	//todo take this from token. Use MSAL library
	//todo always check that we use the correct event id for this user id
	userId = "a84c12d5-9075-42d2-b467-6b345b7d8c9f";

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public eventService: EventService,
		private participantService: ParticipantService,
		private fb: FormBuilder
	) {
		super();
		this.selectedEventDto = computed(() =>
			this.eventService.selectedEventDto()
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
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const eventId = params.get("id");
			if (eventId) {
				this.loadEventDetailDto(eventId);
			}
		});

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.eventForm.get("responseType")?.valueChanges.subscribe(_ => {
			this.clearFields();
		});
	}

	loadEventDetailDto(eventId: string): void {
		this.isPending.set(true);
		this.eventService.getDetailEvent(eventId, this.userId).subscribe({
			next: item => {
				this.eventDetailDto = item;
				this.eventService.selectedEventDto.set(item);
				this.initFields();
				this.initIsAttendingAtOffice();
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
	}

	fromDateTimeISOStringForEventDto() {
		return fromDateTimeISOString(this.selectedEventDto()!.date);
	}

	clearFields(): void {
		this.eventForm.patchValue({
			preferences: this.eventDetailDto?.preferences ?? "",
			allergies: this.eventDetailDto?.allergies ?? "",
			wantsMeal: this.eventDetailDto?.wantsMeal ?? false,
		});
		this.setIsAttendingAtOffice();
	}

	onSubmit = () => {
		const currentParticipantId = this.eventDetailDto?.participantId;
		console.log(currentParticipantId);
		if (currentParticipantId == null) {
			return;
		}

		console.log(this.eventForm.valid);

		if (this.eventForm.valid) {
			const Dto: IParticipantForUpdateDto = {
				responseType: this.eventForm.getRawValue().responseType,
				wantsMeal: this.eventForm.getRawValue().wantsMeal,
				allergies: this.eventForm.getRawValue().allergies,
				preferences: this.eventForm.getRawValue().preferences,
			};
			console.log(Dto);

			this.isPending.set(true);
			this.participantService
				.respondToEvent(Dto, currentParticipantId)
				.subscribe({
					next: response => {
						console.log(response);
					},
					error: error => {
						console.error("Error fetching users:", error);
					},
					complete: () => this.isPending.set(false),
				});
		}
	};

	initFields(): void {
		this.eventForm.setValue({
			preferences: this.eventDetailDto?.preferences ?? "",
			allergies: this.eventDetailDto?.allergies ?? "",
			wantsMeal: this.eventDetailDto?.wantsMeal ?? false,
			responseType: this.eventDetailDto?.responseType ?? "PENDING",
		});
	}

	initIsAttendingAtOffice(): void {
		this.isAttendingAtOffice = computed(
			() => this.eventDetailDto?.responseType == "ATTENDING_OFFICE"
		);
		console.log("init reponse: ", this.eventDetailDto?.responseType);
	}

	setIsAttendingAtOffice(): void {
		this.isAttendingAtOffice = computed(
			() => this.eventForm.value.responseType === "ATTENDING_OFFICE"
		);
		console.log("set reponse: ", this.eventForm.value.responseType);
		console.log("at office: ", this.isAttendingAtOffice());
	}
}
