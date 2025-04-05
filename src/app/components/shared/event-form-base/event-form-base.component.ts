import {
	Component,
	computed,
	effect,
	input,
	OnDestroy,
	OnInit,
	output,
	signal,
} from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

import { ICreateEventForm } from "./interfaces";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";
import { GenericBtnComponent } from "@app/components/html";
import { CommonModule } from "@angular/common";
import { CreateEventFooterContainerComponent } from "./create-event-footer-container/create-event-footer-container.component";
import { CreateEventHeaderContainerComponent } from "./create-event-header-container/create-event-header-container.component";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import {
	formControllers,
	formGroups,
	formTitles,
} from "./constants";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";
import {
	IEventDetailOwnerDto,
	IEventDto,
	IEventForCreationDto,
	IUserDto,
} from "@app/models";
import { EventStateService } from "@app/services";
import {
	subscribeDateDeadlineToDateChange,
	subscribeTimeDeadlineToTimeChange,
	createEventDtoFromCreateEventForm,
} from "./create-event.setup";

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
		CreateEventFooterContainerComponent,
		CreateEventHeaderContainerComponent,
	],
	templateUrl: "./event-form-base.component.html",
})
export class EventFormBaseComponent
	extends AppBaseComponent
	implements OnDestroy, OnInit
{
	formTitles = formTitles;
	private destroy = new Subject<void>();
	readonly formSteps = {
		formDetailStep: 1,
		formUserStep: 2,
		formVerifyStep: 3,
	};
	currentStep = this.formSteps.formDetailStep;
  selectedUsers = signal<IUserDto[]>([]);
  form = input<FormGroup<ICreateEventForm>>();
	initialEvent = input<Partial<IEventDetailOwnerDto>>();
	initialEventId = input<string | null>(null);
  submitEventForm = output<IEventForCreationDto>();
  currentStepChange = output<number>();
	currentEvent: Partial<IEventDto> = {};

  readonly safeForm = computed(() => {
    const value = this.form();
    if (!value) {
      throw new Error('Input "form" must be defined');
    }
    return value;
  });

	constructor(
		private eventStateService: EventStateService,
	) {
		super();
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
		return this.safeForm().get(formGroups.eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.safeForm().get(formGroups.inviteUsersForm) as FormGroup;
	}

	getDerivedUsers() {
		return [
			...(this.initialEvent()?.users ?? []),
			...(this.safeForm().value.inviteUsersForm?.users ?? []),
		];
	}

	toggleEdit() {
		this.eventStateService.toggleEditEvent();
	}

	nextStep() {
		const group = this.getFormGroupForCurrentStep(this.currentStep);
		if (group.invalid) {
			group.markAllAsTouched();
			return;
		}
		this.currentStep++;
    this.currentStepChange.emit(this.currentStep)
	}

	prevStep() {
		this.currentStep--;
    this.currentStepChange.emit(this.currentStep)
	}

	private getFormGroupForCurrentStep(step: number): FormGroup {
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
		const eventDto = createEventDtoFromCreateEventForm(this.safeForm());
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
