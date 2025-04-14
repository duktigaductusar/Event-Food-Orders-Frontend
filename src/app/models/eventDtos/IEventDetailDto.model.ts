import { IEventDto } from "./IEventDto.model";

export interface IEventDetailDto extends IEventDto {
	deadline: string;
	endTime?: string;
	participantId: string;
	allergies: string;
	preferences: string;
}
