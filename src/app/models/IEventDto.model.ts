import type { ParticipantResponseType } from "@types";

export interface IEventDto {
	id: string;
	title: string;
	description: string;
	date: Date;
	isActive?: boolean;
	isOwner: boolean;
	responseType: ParticipantResponseType;	
}
