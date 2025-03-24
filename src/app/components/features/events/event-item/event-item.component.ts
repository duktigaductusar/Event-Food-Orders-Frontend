import { Component, Input, Output, EventEmitter } from "@angular/core";
import type { IEventDto } from "@app/models";
import { AppBaseComponent } from "@app/components/base/app-base.component";
import { DatetimelabelComponent } from "@app/components/shared/datetimelabel/datetimelabel.component";
import { GenericBtnComponent } from "../../../html/generic-btn/generic-btn.component";
import { Router } from "@angular/router";
import { appRoutes } from "@app/constants";
import { EventService } from "@app/services";
import { StatusLabelComponent } from "../status-label/status-label.component";

@Component({
	selector: "app-event-item",
	standalone: true,
	imports: [
		DatetimelabelComponent,
		GenericBtnComponent,
		StatusLabelComponent,
	],
	templateUrl: "event-item.component.html",
	styleUrl: "event-item.component.css",
})
export class EventItemComponent extends AppBaseComponent {
	@Input() eventDto!: IEventDto;
	@Output() cardClick = new EventEmitter<void>();
	@Output() actionClick = new EventEmitter<{
		action: string;
		eventDto: IEventDto;
	}>();

	constructor(
		private router: Router,
		private service: EventService
	) {
		super();
	}

	onAction(event: Event, action: string): void {
		event.stopPropagation(); // Prevent card click event
		this.actionClick.emit({ action, eventDto: this.eventDto });
	}

	selectedEvent() {
		this.service.setSelectedEvent(this.eventDto);
		this.router.navigate([`/${appRoutes.EVENT_DETAILS}`, this.eventDto.id]);
	}

	// selectMoreInfo() {
	// 	throw new Error("");
	// }

	// showInvitation() {
	// 	throw new Error("");
	// }
}
