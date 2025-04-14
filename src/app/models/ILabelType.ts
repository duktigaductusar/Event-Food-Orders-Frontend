import type { ParticipantResponseType } from "@types";

export interface ILabelType {
	responseType: ParticipantResponseType;
	isOwner: boolean;
	wantsMeal: boolean;
}
