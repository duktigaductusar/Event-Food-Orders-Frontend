import { FormControl, FormGroup } from "@angular/forms";
import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import {
	eventDetailsControllerNames,
	eventDetailsValidationGroupKeys,
	eventDetailsValidationKeys,
	formControllers,
	formGroups,
} from "../constants";
import { IUserDto } from "@app/models";

export interface IEventDetailsForm {
	[formControllers.title]: FormControl<string>;
	[formControllers.description]: FormControl<string>;
	[formControllers.date]: FormControl<NgbDateStruct>;
	[formControllers.time]: FormControl<NgbTimeStruct>;
	[formControllers.endTime]: FormControl<NgbTimeStruct>;
	[formControllers.dateDeadline]: FormControl<NgbDateStruct>;
	[formControllers.timeDeadline]: FormControl<NgbTimeStruct>;
}

export interface IInviteForm {
	[formControllers.users]: FormControl<IUserDto[]>;
}

export type FormKeyType = keyof typeof formGroups;

export type EventDetailsValidationKeysType =
	keyof typeof eventDetailsValidationKeys;

export type EventDetailsValidationGroupKeysType =
	keyof typeof eventDetailsValidationGroupKeys;

export type EventDetailsFormControllerNameType =
	keyof typeof eventDetailsControllerNames;

export interface ICreateEventForm {
	[formGroups.eventDetailsForm]: FormGroup<IEventDetailsForm>;
	[formGroups.inviteUsersForm]: FormGroup<IInviteForm>;
}
