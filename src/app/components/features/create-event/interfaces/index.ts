import { FormControl, FormGroup } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

export interface IEventDetailsForm {
	title: FormControl<string>;
	description: FormControl<string>;
	date: FormControl<NgbDateStruct>;
	time: FormControl<NgbTimeStruct>;
    // deadline: FormControl<NgbTimeStruct>;
}

export interface IInviteForm {
	users: FormControl<string>;
}

export const eventDetailsForm = "eventDetailsForm";

export const inviteUsersForm = "inviteUsersForm";

export const verifyForm = "verifyForm";

export interface ICreateEventForm {
	[eventDetailsForm]: FormGroup<IEventDetailsForm>;
	[inviteUsersForm]: FormGroup<IInviteForm>;
}
