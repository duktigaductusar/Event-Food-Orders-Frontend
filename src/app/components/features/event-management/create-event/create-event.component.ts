import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { finalize } from "rxjs";
import {
	NgbDateStruct,
	NgbModal,
	NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { IEventDto, IEventForCreationDto } from "@app/models";
import {
	EventService,
	EventStateService,
	storageKeys,
	StorageService,
} from "@app/services";
import { ApiError } from "@app/interceptors/api-error.interceptor";
import { FormAutoSaver } from "@app/components/base/form-auto-saver.component";
import { SpinnerFullScreenComponent } from "@app/components/shared";
import { CreateEventResultModalComponent } from "./create-event-result-modal/create-event-result-modal.component";
import { Router } from "@angular/router";
import { newEventResultSelection } from "./create-event-result-modal/newEventResultSelection";
import { appRoutes } from "@app/constants";
import {
	EventFormBaseComponent,
	ICreateEventForm,
	buildCreateEventForm,
	isEventFormData,
} from "../event-form-base";

@Component({
	selector: "app-create-event",
	standalone: true,
	imports: [EventFormBaseComponent, SpinnerFullScreenComponent],
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
		private modalService: NgbModal,
		private readonly router: Router
	) {}

	ngOnInit(): void {
		this.form = buildCreateEventForm(this.fb);
		this.autoFormSaver = new FormAutoSaver(
			this.form,
			this.storageService,
			storageKeys.newEventForm,
			isEventFormData
		);
		this.autoFormSaver.subscribe();
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
			.then(reason => {
				this.resetForm();
				if (reason === newEventResultSelection.newEventFormSelection) {
					window.location.reload();
					this.router.navigate([appRoutes.EVENT_CREATE]);
					return;
				}

				if (
					reason === newEventResultSelection.backdrop ||
					reason === newEventResultSelection.esc
				) {
					this.router.navigate([appRoutes.HOME]);
					return;
				}
			})
			.catch(() => {
				this.resetForm();
				this.router.navigate([appRoutes.HOME]);
			});
	}

	resetForm() {
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
		this.storageService.removeItem(storageKeys.newEventForm);
		this.autoFormSaver.destroy();
	}

	ngOnDestroy() {
		this.autoFormSaver.destroy();
	}
}
