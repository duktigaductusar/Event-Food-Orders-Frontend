export interface IEventForCreationDto {
	title: string;
	description: string;
	date: Date;
	endTime: Date | null;
	deadline: Date;
	userIds: string[];
}
