import { Component, input, OnDestroy, signal, OnInit } from "@angular/core";
import { finalize } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { IEventDetailOwnerDto, IEventForCreationDto } from "@app/models";
import { FormAutoSaver } from "@app/components/base/form-auto-saver.component";
import { EventService, EventStateService, StorageService } from "@app/services";
import { ApiError } from "@app/interceptors/api-error.interceptor";
import {
	EventFormBaseComponent,
	ICreateEventForm,
	buildCreateEventForm,
	isFormData,
} from "@app/components/shared";

@Component({
	selector: "app-edit-event",
	imports: [EventFormBaseComponent],
	templateUrl: "./edit-event.component.html",
	styleUrl: "./edit-event.component.css",
})
export class EditEventComponent implements OnDestroy, OnInit {
	event = input<Partial<IEventDetailOwnerDto>>();
	eventId = input<string | null>(null);

	form!: FormGroup<ICreateEventForm>;
	isPending = signal(false);
	private autoFormSaver!: FormAutoSaver<Partial<IEventForCreationDto>>;

	constructor(
		private fb: FormBuilder,
		private eventService: EventService,
		private eventStateService: EventStateService,
		private storageService: StorageService
	) {
		this.form = buildCreateEventForm(this.fb, this.event());
	}

	ngOnInit(): void {
		this.autoFormSaver = new FormAutoSaver(
			this.form,
			this.storageService,
			"UPDATE_EVENT_FORM",
			isFormData
		);
	}

	submitEdit(eventDto: IEventForCreationDto) {
		const currentEventId = this.eventId();
		if (currentEventId == null) {
			return;
		}

		this.isPending.set(true);
		this.eventService
			.updateEvent(currentEventId, eventDto)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: () => {
					this.storageService.clear();
					this.eventStateService.toggleEditEvent();
				},
				error: (error: ApiError) => {
					console.error("Error fetching users:", error.message);
				},
				complete: () => {
					this.autoFormSaver.destroy();
				},
			});
	}

	ngOnDestroy() {
		this.autoFormSaver.destroy();
	}
}
