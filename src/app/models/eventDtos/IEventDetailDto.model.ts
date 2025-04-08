import { IEventDto } from "./IEventDto.model";

export interface IEventDetailDto extends IEventDto {
	deadline: string;
	participantId: string;
	wantsMeal: boolean;
	allergies: string;
	preferences: string;
}
