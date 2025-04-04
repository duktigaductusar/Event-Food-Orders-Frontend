import { IParticipantWithUserDto } from "../participantDtos/IParticipantWithUserDto.model";
import { IEventDetailDto } from "./IEventDetailDto.model";

export interface IEventDetailInfoDto extends IEventDetailDto {
    participants: IParticipantWithUserDto[];
}
