import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";

export function getEndDate(date?: NgbDateStruct, time?: NgbTimeStruct) {
	if (date == null || time?.hour == null || time?.minute == null) {
		return null;
	}

	return new Date(
		date.year,
		date.month - 1,
		date.day,
		time.hour,
		time.minute,
		time.second
	);
};

export function toDateTimeISOStrig(date: NgbDateStruct, time: NgbTimeStruct) {
	return new Date(
		date.year,
		date.month - 1,
		date.day,
		time.hour,
		time.minute,
		time.second
	).toISOString();
};