import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datetimelabel',
  imports: [CommonModule],
  templateUrl: './datetimelabel.component.html',
  styleUrl: './datetimelabel.component.css'
})
export class DatetimelabelComponent implements OnInit {  
  @Input() datevalue!: Date;

  ngOnInit() {
    if (this.datevalue === undefined) {
      throw new Error(`The 'datevalue' attribute is required for <app-datetimelabel>`);
    }
  }

}
