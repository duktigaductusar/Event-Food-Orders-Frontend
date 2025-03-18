//toDo: Update to match specification from server

export interface IEventDto {
	id: number;
	title: string;
	description: string;
	date: Date;
	// Current specification:
	// EventId: string
	// EventName: string
	// EventDate: Date
	// Description: string
	// EventActive: bool
}
