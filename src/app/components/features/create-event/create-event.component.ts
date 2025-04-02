import {
	Component,
	effect,
	inject,
	input,
	OnDestroy,
	OnInit,
	signal,
} from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

import { ICreateEventForm } from "./interfaces";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";
import { GenericBtnComponent } from "@app/components/html";
import { breakpoints } from "@app/components/style";
import { CommonModule } from "@angular/common";
import { CreateEventFooterContainerComponent } from "./create-event-footer-container/create-event-footer-container.component";
import { CreateEventHeaderContainerComponent } from "./create-event-header-container/create-event-header-container.component";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { formControllers, formGroups, formTitles } from "./constants";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";
import { IEventDetailOwnerDto, IEventDto, IUserDto } from "@app/models";
import { EventService } from "@app/services";
import {
	buildCreateEventForm,
	subscribeDateDeadlineToDateChange,
	subscribeTimeDeadlineToTimeChange,
	createEventDtoFromCreateEventForm,
} from "./create-event.setup";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CreateEventResultModalComponent } from "./create-event-result-modal/create-event-result-modal.component";
import { ApiError } from "@app/interceptors/api-error.interceptor";

/**
 * TODO:
 * 1) Create Server
 * 		1.1) For shared state
 * 		1.2) For local/session storage state if needed
 */
@Component({
	selector: "app-create-event",
	standalone: true,
	imports: [
		CommonModule,
		GenericBtnComponent,
		EventDetailsFormComponent,
		EventUserFormComponent,
		VerifyEventFormComponent,
		MultiStepFormHeaderComponent,
		CreateEventFooterContainerComponent,
		CreateEventHeaderContainerComponent,
	],
	templateUrl: "./create-event.component.html",
})
export class CreateEventComponent
	extends AppBaseComponent
	implements OnDestroy, OnInit
{
	form!: FormGroup<ICreateEventForm>;
	formTitles = formTitles;
	private destroy = new Subject<void>();
	readonly formSteps = {
		formDetailStep: 1,
		formUserStep: 2,
		formVerifyStep: 3,
	};
	currentStep = this.formSteps.formDetailStep;
	isPending = signal(false);
	selectedUsers = signal<IUserDto[]>([]);
	initialEvent = input<IEventDetailOwnerDto>();
	private modalService = inject(NgbModal);

	constructor(
		private fb: FormBuilder,
		private eventService: EventService
	) {
		super();
		this.form = buildCreateEventForm(this.fb);
		this.selectedUsersEffect();
	}

	selectedUsersEffect() {
		effect(() => {
			const form = this.getFormGroupForCurrentStep(
				this.formSteps.formUserStep
			);
			form.get(formControllers.users)?.setValue(this.selectedUsers());
			form.get(formControllers.users)?.markAsTouched();
		});
	}

	ngOnInit(): void {
		subscribeDateDeadlineToDateChange(
			this.eventDetailsFormGroup,
			this.destroy
		);
		subscribeTimeDeadlineToTimeChange(
			this.eventDetailsFormGroup,
			this.destroy
		);
	}

	get eventDetailsFormGroup(): FormGroup {
		return this.form.get(formGroups.eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.form.get(formGroups.inviteUsersForm) as FormGroup;
	}

	nextStep() {
		const group = this.getFormGroupForCurrentStep(this.currentStep);
		if (group.invalid) {
			group.markAllAsTouched();
			return;
		}
		this.currentStep++;
	}

	prevStep() {
		this.currentStep--;
	}

	private getFormGroupForCurrentStep(step: number): FormGroup {
		return this.form.get(
			[
				formGroups.eventDetailsForm,
				formGroups.inviteUsersForm,
				formGroups.verifyForm,
			][step - 1]
		) as FormGroup;
	}

	getSubFormTitles() {
		return [
			formTitles.eventDetailTitle,
			formTitles.addUserTitle,
			formTitles.formVerificationTitle,
		];
	}

	getDerivedContainerStyle() {
		return { "max-width": `${breakpoints.lg}px` };
	}

	onSelectedUsersChange(user: IUserDto) {
		this.selectedUsers.update(prev => {
			const alreadySelected = prev.some(u => u.userId === user.userId);
			return alreadySelected
				? prev.filter(u => u.userId !== user.userId)
				: [...prev, user];
		});
	}

	submit = () => {
		const eventDto = createEventDtoFromCreateEventForm(this.form);
		if (eventDto == null) {
			this.form.markAllAsTouched();
			return;
		}

		this.isPending.set(true);
		console.log("eventDto", eventDto)
		this.eventService.createEvent(eventDto).subscribe({
			next: event => {
				this.openSuccessModal(event as IEventDto);
			},
			error: (error: ApiError) => {
				console.error("Error fetching users:", error.message);
			},
			complete: () => this.isPending.set(false),
		});
	};

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
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
