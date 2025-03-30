import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { GenericBtnComponent } from '@app/components/html';
import { IEventDto } from '@app/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-create-event-result-modal',
	imports: [CommonModule, GenericBtnComponent],
	standalone: true,
	templateUrl: './create-event-result-modal.component.html',
})
export class CreateEventResultModalComponent {
	activeModal = inject(NgbActiveModal);
	@Input() event: IEventDto | null = null;
	@Input() error: string | null = null;
}
