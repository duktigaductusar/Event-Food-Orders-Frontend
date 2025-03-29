import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-required-label',
  imports: [],
  templateUrl: './required-label.component.html',
  styleUrl: './required-label.component.css'
})
export class RequiredLabelComponent {
  @Input() label = "Input label"
}
