import { Component, input, signal, OnInit, computed } from "@angular/core";
import { finalize } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { IEventDetailOwnerDto, IEventForCreationDto } from "@app/models";
import { FormAutoSaver } from "@app/components/base/form-auto-saver.component";
import { EventService, EventStateService } from "@app/services";
import { ApiError } from "@app/interceptors/api-error.interceptor";
import {
	buildCreateEventForm,
	EventFormBaseComponent,
	ICreateEventForm,
} from "@app/components/shared";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";

@Component({
	selector: "app-edit-event",
	imports: [EventFormBaseComponent, GenericBtnComponent],
	templateUrl: "./edit-event.component.html",
	styleUrl: "./edit-event.component.css",
})
export class EditEventComponent implements OnInit {
	form!: FormGroup<ICreateEventForm>;
	computedForm = computed(() => this.form);
	isPending = signal(false);
	event = input<Partial<IEventDetailOwnerDto>>();
	eventId = input<string | null>(null);
	private autoFormSaver: FormAutoSaver<Partial<IEventForCreationDto>> | null =
		null;

	constructor(
		private fb: FormBuilder,
		private eventService: EventService,
		private eventStateService: EventStateService
	) {}

	ngOnInit(): void {
		this.form = buildCreateEventForm(this.fb, this.event());
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
					window.location.reload();
				},
				error: (error: ApiError) => {
					console.error("Error fetching users:", error.message);
				},
				complete: () => {
					this.autoFormSaver?.destroy();
				},
			});
	}
}
