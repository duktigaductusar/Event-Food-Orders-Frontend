//toDo: Update to match specification from server

type ParticipantResponseType =
	| "PENDING"
	| "ATTENDING_ONLINE"
	| "ATTENDING_OFFICE"
	| "NOT_ATTENDING";

export interface IEventDto {
	id: number;
	title: string;
	description: string;
	date: Date;
	isOwner: boolean;
	response: ParticipantResponseType;
	wantsMeal: boolean;
	// Current specification:
	// EventId: string
	// EventName: string
	// EventDate: Date
	// Description: string
	// EventActive: bool
}
