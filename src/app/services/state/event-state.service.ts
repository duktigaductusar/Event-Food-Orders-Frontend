import { Injectable, signal } from "@angular/core";
import { IEventDto } from "@app/models";

@Injectable({
	providedIn: "root",
})
export class EventStateService {
	selectedEventDto = signal<IEventDto | null>(null);

	setSelectedEvent(item: IEventDto) {
		this.selectedEventDto.set(item);
	}
}
