import type { ParticipantResponseType } from "@types";

export interface IParticipantForUpdateDto {
	responseType: ParticipantResponseType;
	wantsMeal: boolean;
	allergies: string;
	preferences: string;
}
