export interface IEventForUpdateDto {
	title: string;
	description: string;
	date: string;
	endTime: string | null;
	deadline: string;
	userIds: string[];
}
