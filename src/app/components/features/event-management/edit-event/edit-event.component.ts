import { Component, input } from "@angular/core";
import { CreateEventComponent } from "../../create-event/create-event.component";
import { IEventDetailOwnerDto } from "@app/models";

@Component({
	selector: "app-edit-event",
	imports: [CreateEventComponent],
	templateUrl: "./edit-event.component.html",
	styleUrl: "./edit-event.component.css",
})
export class EditEventComponent {
	event = input<Partial<IEventDetailOwnerDto>>();
	eventId = input<string | null>(null);
}
