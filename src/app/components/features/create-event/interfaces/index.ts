import { FormControl, FormGroup } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

export interface IEventDetailsForm {
	title: FormControl<string>;
	description: FormControl<string>;
	date: FormControl<NgbDateStruct>;
	time: FormControl<NgbTimeStruct>;
	endTime: FormControl<NgbTimeStruct>;
	dateDeadline: FormControl<NgbDateStruct>;
	timeDeadline: FormControl<NgbTimeStruct>;
}

export interface IInviteForm {
	emails: FormControl<string[]>;
}

export const eventDetailsForm = "eventDetailsForm";

export const inviteUsersForm = "inviteUsersForm";

export const verifyForm = "verifyForm";

export interface ICreateEventForm {
	[eventDetailsForm]: FormGroup<IEventDetailsForm>;
	[inviteUsersForm]: FormGroup<IInviteForm>;
}
