import { Component, effect, input, OnDestroy, OnInit, signal } from "@angular/core";
import { EventDetailsFormComponent } from "./event-details-form/event-details-form.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

import { ICreateEventForm } from "./interfaces";
import { MultiStepFormHeaderComponent } from "./multistep-form-navigation-header/multistep-form-navigation-header.component";
import { GenericBtnComponent, AppSimpleModalComponent } from "@app/components/html";
import { breakpoints } from "@app/components/style";
import { CommonModule } from "@angular/common";
import { CreateEventFooterContainerComponent } from "./create-event-footer-container/create-event-footer-container.component";
import { CreateEventHeaderContainerComponent } from "./create-event-header-container/create-event-header-container.component";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { eventDetailsForm, formTitles, inviteUsersForm, users, verifyForm } from "./constants";
import { EventUserFormComponent } from "./event-user-form/event-user-form.component";
import { VerifyEventFormComponent } from "./verify-event-form/verify-event-form.component";
import { IEventDetailOwnerDto, IUserDto } from "@app/models";
import { EventService } from "@app/services";
import { buildCreateEventForm, subscribeDateDeadlineToDateChange, subscribeTimeDeadlineToTimeChange, createEventDtoFromCreateEventForm } from "./create-event.setup";

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
		AppSimpleModalComponent
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
	}
	currentStep = this.formSteps.formDetailStep;
	isPending = signal(false);
	selectedUsers = signal<IUserDto[]>([]);
	initialEvent = input<IEventDetailOwnerDto>()

	constructor(private fb: FormBuilder, private service: EventService) {
		super();
		this.form = buildCreateEventForm(this.fb);
		this.selectedUsersEffect();
	}

	selectedUsersEffect() {
		effect(() => {
			const form = this.getFormGroupForCurrentStep(this.formSteps.formUserStep);
			form.get(users)?.setValue(this.selectedUsers());
			form.get(users)?.markAsTouched();
		})
	}

	ngOnInit(): void {
		subscribeDateDeadlineToDateChange(this.eventDetailsFormGroup, this.destroy);
		subscribeTimeDeadlineToTimeChange(this.eventDetailsFormGroup, this.destroy);
	}

	get eventDetailsFormGroup(): FormGroup {
		return this.form.get(eventDetailsForm) as FormGroup;
	}

	get inviteUsersForm(): FormGroup {
		return this.form.get(inviteUsersForm) as FormGroup;
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
			[eventDetailsForm, inviteUsersForm, verifyForm][step - 1]
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
		this.service.createEvent(eventDto).subscribe({
			next: event => {
				console.log('created event: ', event);
			},
			error: error => {
				console.error("Error fetching users:", error);
			},
			complete: () => this.isPending.set(false),
		});
	};

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
