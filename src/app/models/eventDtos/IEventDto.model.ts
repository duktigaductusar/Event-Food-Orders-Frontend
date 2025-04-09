import type { ParticipantResponseType } from "@types";
import { ILabelType } from "../ILabelType";

export interface IEventDto extends ILabelType {
	id: string;
	title: string;
	description: string;
	date: string;
	isActive?: boolean;
	isOwner: boolean;
	responseType: ParticipantResponseType;
	participantId: string;
}
