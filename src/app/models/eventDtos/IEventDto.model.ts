import type { ParticipantResponseType } from "@types";

export interface IEventDto {
	id: string;
	title: string;
	description: string;
	date: string;
	isActive?: boolean;
	isOwner: boolean;
	responseType: ParticipantResponseType;
	participantId: string;
}
