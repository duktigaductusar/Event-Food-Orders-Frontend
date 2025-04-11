import {
	Component,
	computed,
	effect,
	input,
	OnDestroy,
	output,
	signal,
	AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

import { AppBaseComponent } from "@app/components/base";
import {
	IEventDetailOwnerDto,
	IEventDto,
	IEventForCreationDto,
	IUserDto,
} from "@app/models";
import { GenericBtnComponent } from "@app/components/html";
import {
	formControllers,
	formGroups,
	formSteps,
	formTitles,
} from "./constants";
import { EventFormFooterContainerComponent } from "./event-form-footer-container/event-form-footer-container.component";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";

import {
	subscribeDateDeadlineToDateChange,
	subscribeTimeDeadlineToTimeChange,
} from "./event-form.setup";
import { createEventDtoFromEventForm } from "./event-form.utility";
import { EventFormHeaderContainerComponent } from "./event-form-header-container/event-form-header-container.component";
import { FormStepsTyp, ICreateEventForm } from "./interfaces";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";

@Component({
	selector: "app-event-form-base",
	standalone: true,
	imports: [
		CommonModule,
		GenericBtnComponent,
		EventDetailsFormComponent,
		EventUserFormComponent,
		VerifyEventFormComponent,
		MultiStepFormHeaderComponent,
		EventFormFooterContainerComponent,
		EventFormHeaderContainerComponent,
	],
	templateUrl: "./event-form-base.component.html",
})
export class EventFormBaseComponent
	extends AppBaseComponent
	implements OnDestroy, AfterViewInit
{
	formTitles = formTitles;
	private destroy = new Subject<void>();
	readonly formSteps = formSteps;
	currentStep = signal<FormStepsTyp>(this.formSteps.formDetailStep);
	selectedUsers = signal<IUserDto[]>([]);
	changedDeadline = signal<NgbDateStruct | null>(null);
	form = input<FormGroup<ICreateEventForm>>();
	initialEvent = input<Partial<IEventDetailOwnerDto>>();
	initialEventId = input<string | null>(null);
	submitEventForm = output<IEventForCreationDto>();
	currentStepChange = output<FormStepsTyp>();
	currentEvent: Partial<IEventDto> = {};

	readonly safeForm = computed(() => {
		const value = this.form();
		if (!value) {
			throw new Error('Input "form" must be defined');
		}
		return value;
	});

	constructor() {
		super();
		this.selectedUsersEffect();
	}

	selectedUsersEffect() {
		effect(() => {
			const form = this.getFormGroupForCurrentStep(
				this.formSteps.formUserStep
			);
			const initUsers = this.initialEvent()?.users ?? [];
			form
				.get(formControllers.users)
				?.setValue([...initUsers, ...this.selectedUsers()]);
			form.get(formControllers.users)?.markAsTouched();
		});
	}

	ngAfterViewInit(): void {
		subscribeDateDeadlineToDateChange(
			this.eventDetailsFormGroup,
			this.destroy,
			this.changedDeadline
		);
		subscribeTimeDeadlineToTimeChange(
			this.eventDetailsFormGroup,
			this.destroy
		);
	}

	get eventDetailsFormGroup(): FormGroup {
		return this.safeForm().get(formGroups.eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.safeForm().get(formGroups.inviteUsersForm) as FormGroup;
	}

	getDerivedUsers() {
		return [...(this.safeForm().value.inviteUsersForm?.users ?? [])];
	}

	nextStep() {
		const group = this.getFormGroupForCurrentStep(this.currentStep());
		if (group.invalid) {
			group.markAllAsTouched();
			return;
		}
		this.currentStep.update(prev => {
			if (this.currentStep() === Object.keys(this.formSteps).length) {
				return prev;
			}
			return (prev + 1) as FormStepsTyp;
		});
		this.currentStepChange.emit(this.currentStep());
	}

	prevStep() {
		this.currentStep.update(prev => {
			if (this.currentStep() === 1) {
				return prev;
			}
			return (prev - 1) as FormStepsTyp;
		});
		this.currentStepChange.emit(this.currentStep());
	}

	getFormGroupForCurrentStep(step: number): FormGroup {
		return this.safeForm().get(
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

	onSelectedUsersChange(user: IUserDto) {
		this.selectedUsers.update(prev => {
			const alreadySelected = prev.some(u => u.userId === user.userId);
			return alreadySelected
				? prev.filter(u => u.userId !== user.userId)
				: [...prev, user];
		});
	}

	submit = () => {
		const eventDto = createEventDtoFromEventForm(this.safeForm());
		if (eventDto == null) {
			this.form()?.markAllAsTouched();
			return;
		}

		this.submitEventForm.emit(eventDto);
	};

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
