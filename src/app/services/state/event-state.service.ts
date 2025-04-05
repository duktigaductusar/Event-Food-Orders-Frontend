import { Injectable, signal } from "@angular/core";
import { IEventDto } from "@app/models";

@Injectable({
	providedIn: "root",
})
export class EventStateService {
	editEvent = signal(false);

	selectedEventDto = signal<IEventDto | null>(null);

	setSelectedEvent(item: IEventDto) {
		this.selectedEventDto.set(item);
	}

	toggleEditEvent(callback?: () => void) {
		this.editEvent.update(prev => !prev);
		if (callback != null) {
			callback();
		}
	}
}
