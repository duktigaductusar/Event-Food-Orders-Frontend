import { Component, inject, Input } from '@angular/core';
import { AppBaseComponent } from '@app/components/base/app-base.component';
import { GenericBtnComponent } from '@app/components/html';
import { IEventDetailDto } from '@app/models/IEventDetailDto.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-management-delete-modal-component',
  imports: [GenericBtnComponent],
  templateUrl: './event-management-delete-modal-component.component.html',
  styleUrl: './event-management-delete-modal-component.component.css'
})
export class EventManagementDeleteModalComponentComponent
  extends AppBaseComponent
{
	activeModal = inject(NgbActiveModal);
	@Input() event: IEventDetailDto | null = null;
}
