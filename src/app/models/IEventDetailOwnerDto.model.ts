import { IUserDto } from "./IUserDto.model";

export interface IEventDetailOwnerDto {
	title: string;
	description: string;
	date: string;
	endTime: string | null;
	deadline: string;
	users: IUserDto[];
}
