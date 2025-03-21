import { Component, OnInit, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppBaseComponent } from '@app/components/base/app-base.component';
import { EventService } from '@app/services';
import { DatetimelabelComponent } from "../../../shared/datetimelabel/datetimelabel.component";
import { IEventDto } from '@app/models';

@Component({
  selector: 'app-event-detail-item',
  imports: [DatetimelabelComponent],
  templateUrl: './event-detail-item.component.html',
  styleUrl: './event-detail-item.component.css'
})
export class EventDetailItemComponent extends AppBaseComponent implements OnInit{  
  currentSelectedEventDto : Signal<IEventDto | null>

  constructor(private router:Router, public service:EventService) {
		super();
    this.currentSelectedEventDto = signal(this.service.currentSelectedEventDto());
	}
  ngOnInit(): void {
    console.log(this.service?.currentSelectedEventDto());
  }

}
