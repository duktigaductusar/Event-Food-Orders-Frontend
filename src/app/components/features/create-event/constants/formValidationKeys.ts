export const eventDetailsValidationKeys = {
	invalidDateDeadline: "invalidDateDeadline",
	invalidTimeDeadline: "invalidTimeDeadline",
	invalidDate: "invalidDate",
	invalidTime: "invalidTime",
	required: "required",
} as const;

export const eventDetailsValidationGroupKeys = {
	eventEndBeforeStart: "eventEndBeforeStart",
	deadlineAfterEvent: "deadlineAfterEvent",
} as const;
