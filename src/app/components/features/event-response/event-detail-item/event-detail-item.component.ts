import { Component, OnInit, Signal, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { EventService } from "@app/services";
import { DatetimelabelComponent } from "../../../shared/datetimelabel/datetimelabel.component";
import { IEventDto, IParticipantForResponseDto, IParticipantForUpdateDto } from "@app/models";
import { StatusLabelComponent } from "../../../shared/status-label/status-label.component";
import { ResponsiveFormComponent } from "../../../html/responsive-form/responsive-form.component";
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { IEventDetailDto } from "@app/models/IEventDetailDto.model";
import { IParticipantResponseForm } from "../interfaces";
import type { ParticipantResponseType } from "@types";
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

	eventDetailDto: IEventDetailDto | null = null;

	responseTypes: { id: ParticipantResponseType, label: string }[] = [
		{ id: "PENDING", label: "Avvaktar"},
		{ id: "ATTENDING_ONLINE", label: "Online"},
		{ id: "ATTENDING_OFFICE", label: "På plats"},
		{ id: "NOT_ATTENDING", label: "Avvisa"}
	 ] as const;

	isPending = signal(false);

	//todo take this from token. Use MSAL library
	userId = "77d7e9a1-baff-493f-b9f4-9497a07b94fc"

	constructor(
		private router: Router,
		public eventService: EventService,
		private participantService: ParticipantService,
		private fb: FormBuilder
	) {
		super();
		this.selectedEventDto = signal(this.eventService.selectedEventDto());
		this.eventForm = this.fb.nonNullable.group({
			preferences: fb.nonNullable.control("", [Validators.minLength(3)]),
			allergies: fb.nonNullable.control("", [Validators.minLength(10)]),
			wantsMeal: fb.nonNullable.control(false, [Validators.required]),
			responseType: fb.nonNullable.control("PENDING" as ParticipantResponseType, [Validators.required]),
		});
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
				this.eventDetailDto = item;
				console.log(item);
			},
			error: error => console.error("Test error" + error),
			complete: () => this.isPending.set(false),
		});
	}

	getDerivedTitle() {
		const currentTitle = this.eventDetailDto; 
		if (currentTitle == null) {
			return this.selectedEventDto()?.title
		}
		return currentTitle.title
	}

	onSubmit = () => {
		const currentParticipantId = this.eventDetailDto?.participantId
		if (currentParticipantId == null) {
			return
		}

		if (this.eventForm.valid) {
			// console.log("Event Created:", this.eventForm.value);
			const Dto:IParticipantForUpdateDto= {
				responseType: this.eventForm.value.responseType ?? "PENDING",
				wantsMeal: this.eventForm.value.wantsMeal ?? false,
				allergies: this.eventForm.value.allergies ?? '',
				preferences: this.eventForm.value.preferences ?? ''
			}
			console.log(Dto)

			this.isPending.set(true);
			this.participantService.respondToEvent(Dto,currentParticipantId).subscribe({
				next: response => {
					console.log(response)
				},
				error: error => {
					console.error("Error fetching users:", error);					
				},
				complete: () => this.isPending.set(false),
			});
		}
	};

	isAttendingAtOffice() {
		return this.eventForm.value.responseType === "ATTENDING_OFFICE"		
	}
}
