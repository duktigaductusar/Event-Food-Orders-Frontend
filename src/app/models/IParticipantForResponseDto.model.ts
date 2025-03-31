import type { ParticipantResponseType } from "@types";

export interface IParticipantForResponseDto {
	userId: string;
    eventId: string;
	wantsMeal: boolean;
	allergies: string;
	preferences: string | null;
	responseType: ParticipantResponseType;	
}
