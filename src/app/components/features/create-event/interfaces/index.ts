import { FormControl, FormGroup } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import * as formConstants from "../constants";

export interface IEventDetailsForm {
	[formConstants.title]: FormControl<string>;
	[formConstants.description]: FormControl<string>;
	[formConstants.date]: FormControl<NgbDateStruct>;
	[formConstants.time]: FormControl<NgbTimeStruct>;
	[formConstants.endTime]: FormControl<NgbTimeStruct>;
	[formConstants.dateDeadline]: FormControl<NgbDateStruct>;
	[formConstants.timeDeadline]: FormControl<NgbTimeStruct>;
}

export interface IInviteForm {
	emails: FormControl<string[]>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mainFormKeys = {
	eventDetailsForm: formConstants.eventDetailsForm,
	inviteUsersForm: formConstants.inviteUsersForm,
} as const;

export type FormKeyType = keyof typeof mainFormKeys;

export type EventDetailsValidationKeysType =
	keyof typeof formConstants.eventDetailsValidationKeys;

export type EventDetailsValidationGroupKeysType =
	keyof typeof formConstants.eventDetailsValidationGroupKeys;

export type EventDetailsFormControllerNameType =
	keyof typeof formConstants.eventDetailsControllerNames;

export interface ICreateEventForm {
	[formConstants.eventDetailsForm]: FormGroup<IEventDetailsForm>;
	[formConstants.inviteUsersForm]: FormGroup<IInviteForm>;
}
