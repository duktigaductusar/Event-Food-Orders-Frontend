import {
	Component,
	OnDestroy,
	OnInit,
	signal,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { finalize } from "rxjs";

import { ICreateEventForm } from "./interfaces";
import { newEventResultSelection } from "./constants";
import { IEventDto, IEventForCreationDto } from "@app/models";
import { EventService, EventStateService, StorageService } from "@app/services";
import { buildCreateEventForm, } from "./create-event.setup";
import { NgbDateStruct, NgbModal, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { CreateEventResultModalComponent } from "./create-event-result-modal/create-event-result-modal.component";
import { ApiError } from "@app/interceptors/api-error.interceptor";
import { FormAutoSaver } from "@app/components/base/form-auto-saver.component";
import { isFormData } from "./create-event.utility";
import { EventFormBaseComponent } from "@app/components/shared";

@Component({
	selector: "app-create-event",
	standalone: true,
	imports: [EventFormBaseComponent],
	templateUrl: "./create-event.component.html",
})
export class CreateEventComponent implements OnDestroy, OnInit {
	form!: FormGroup<ICreateEventForm>;
	isPending = signal(false);
	private autoFormSaver!: FormAutoSaver<Partial<IEventForCreationDto>>;

	constructor(
		private fb: FormBuilder,
		private eventService: EventService,
		private eventStateService: EventStateService,
		private storageService: StorageService,
		private modalService: NgbModal
	) {
		this.form = buildCreateEventForm(this.fb);
	}

	ngOnInit(): void {
		this.autoFormSaver = new FormAutoSaver(
			this.form,
			this.storageService,
			"NEW_EVENT_FORM",
			isFormData
		);
	}

	submitCreate(eventDto: IEventForCreationDto) {
		this.isPending.set(true);
		this.eventService
			.createEvent(eventDto)
			.pipe(finalize(() => this.isPending.set(false)))
			.subscribe({
				next: event => {
					this.eventStateService.selectedEventDto.set(null);
					this.openSuccessModal(event);
				},
				error: (error: ApiError) => {
					console.error("Error fetching users:", error.message);
				},
				complete: () => {
					this.autoFormSaver.destroy();
				},
			});
	}

	openSuccessModal(event: IEventDto) {
		const modalRef = this.modalService.open(
			CreateEventResultModalComponent,
			{
				container: "body",
				backdrop: true,
				centered: true,
				backdropClass: "app-modal-custom",
			}
		);
		modalRef.componentInstance.event = event;

		modalRef.result
			.then(result => {
				this.storageService.clear();
				if (result === newEventResultSelection.newEventFormSelection) {
					this.resetForm()
				}
			})
			.catch(reason => {
				console.log("Modal dismissed:", reason);
			});
	}

	resetForm() {
		window.location.reload();
		this.autoFormSaver.destroy();
		this.form.reset({
			eventDetailsForm: {
				title: "",
				description: "",
				date: {} as NgbDateStruct,
				time: {} as NgbTimeStruct,
				endTime: {} as NgbTimeStruct,
				dateDeadline: {} as NgbDateStruct,
				timeDeadline: {} as NgbTimeStruct,
			},
			inviteUsersForm: {
				users: [],
			},
		});
	}

	ngOnDestroy() {
		this.autoFormSaver.destroy();
	}
}
