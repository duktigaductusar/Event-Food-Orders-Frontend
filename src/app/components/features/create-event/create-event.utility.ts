import { IEventForCreationDto } from "@app/models";

export function isFormData(
	value: unknown
): value is Partial<IEventForCreationDto> {
	if (typeof value !== "object" || value === null) return false;

	const val = value as Partial<IEventForCreationDto>;

	return (
		(val.title === undefined || typeof val.title === "string") &&
		(val.description === undefined ||
			typeof val.description === "string") &&
		(val.date === undefined || typeof val.date === "string") &&
		(val.endTime == null || typeof val.endTime === "string") &&
		(val.deadline === undefined || typeof val.deadline === "string") &&
		(val.userIds === undefined ||
			(Array.isArray(val.userIds) &&
				val.userIds.every(id => typeof id === "string")))
	);
}
