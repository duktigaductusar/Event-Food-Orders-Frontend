import { IEventDto } from "./IEventDto.model";

export interface IEventDetailDto extends IEventDto {
	deadline: Date;
	participantId: string;
	wantsMeal: boolean;
	allergies: string[];
	preferences: string[];
	// todo: Lägg till ownerName från Entra?
}
