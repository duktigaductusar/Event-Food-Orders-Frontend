import { FormControl, FormGroup } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import * as formKeys from "../constants"


export interface IEventDetailsForm {
	[formKeys.title]: FormControl<string>;
	[formKeys.description]: FormControl<string>;
	[formKeys.date]: FormControl<NgbDateStruct>;
	[formKeys.time]: FormControl<NgbTimeStruct>;
	[formKeys.endTime]: FormControl<NgbTimeStruct>;
	[formKeys.dateDeadline]: FormControl<NgbDateStruct>;
	[formKeys.timeDeadline]: FormControl<NgbTimeStruct>;
}

export interface IInviteForm {
	emails: FormControl<string[]>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mainFormKeys = {
	eventDetailsForm: formKeys.eventDetailsForm,
	inviteUsersForm: formKeys.inviteUsersForm,
} as const;

export type FormKeyType = keyof typeof mainFormKeys;

export type EventDetailsValidationKeysType = keyof typeof formKeys.eventDetailsValidationKeys;

export type EventDetailsValidationGroupKeysType = keyof typeof formKeys.eventDetailsValidationGroupKeys;

export interface ICreateEventForm {
	[formKeys.eventDetailsForm]: FormGroup<IEventDetailsForm>;
	[formKeys.inviteUsersForm]: FormGroup<IInviteForm>;
}
