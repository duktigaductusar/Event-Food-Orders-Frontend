import {
	Component,
	input,
	OnDestroy,
	signal,
	OnInit,
	computed,
} from "@angular/core";
import { finalize } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { IEventDetailOwnerDto, IEventForCreationDto } from "@app/models";
import { FormAutoSaver } from "@app/components/base/form-auto-saver.component";
import { EventService, EventStateService, StorageService } from "@app/services";
import { ApiError } from "@app/interceptors/api-error.interceptor";
import {
	buildCreateEventForm,
	EventFormBaseComponent,
	ICreateEventForm,
	isEventFormData,
} from "@app/components/shared";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";
import { storageKeys } from "@app/services/utility/storage.service";

@Component({
	selector: "app-edit-event",
	imports: [EventFormBaseComponent, GenericBtnComponent],
	templateUrl: "./edit-event.component.html",
	styleUrl: "./edit-event.component.css",
})
export class EditEventComponent implements OnDestroy, OnInit {
	form!: FormGroup<ICreateEventForm>;
	computedForm = computed(() => this.form);
	isPending = signal(false);
	event = input<Partial<IEventDetailOwnerDto>>();
	eventId = input<string | null>(null);
	private autoFormSaver!: FormAutoSaver<Partial<IEventForCreationDto>>;

	constructor(
		private fb: FormBuilder,
		private eventService: EventService,
		private eventStateService: EventStateService,
		private storageService: StorageService
	) {
		this.synchronizeAutoSaverData =
			this.synchronizeAutoSaverData.bind(this);
	}

	ngOnInit(): void {
		this.form = buildCreateEventForm(this.fb, this.event());

		this.autoFormSaver = new FormAutoSaver(
			this.form,
			this.storageService,
			storageKeys.updateEventForm,
			isEventFormData,
			{ setupCallback: this.synchronizeAutoSaverData }
		);
		this.autoFormSaver.subscribe();
	}

	synchronizeAutoSaverData() {
		const storedEventId = this.storageService.getItem(
			storageKeys.updateEventId,
			(value): value is string => typeof value === "string"
		);

		if (storedEventId == null || storedEventId !== this.eventId()) {
			this.storageService.setItem(
				storageKeys.updateEventId,
				this.eventId()
			);
			this.storageService.setItem(
				storageKeys.updateEventForm,
				this.form.value
			);
		}
	}

	getTitleForEditingForm() {
		return `Stop editing '${this.event()?.title}'`;
	}

	toggleEdit() {
		this.eventStateService.toggleEditEvent();
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
					this.storageService.removeItem(storageKeys.updateEventForm);
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
