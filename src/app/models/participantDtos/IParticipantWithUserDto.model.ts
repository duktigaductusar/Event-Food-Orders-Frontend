import { ParticipantResponseType } from "@types";

export interface IParticipantWithUserDto {
    eventId: string;
    wantsMeal: boolean;
    allergies: string;
    preferences: string | null;
    responseType: ParticipantResponseType;
    userId: string;
    userName: string;
    email: string;
}
