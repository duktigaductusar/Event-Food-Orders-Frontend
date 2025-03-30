import { Component, input } from '@angular/core';

@Component({
  selector: 'app-invalid-input-feedback',
  imports: [],
  templateUrl: './invalid-input-feedback.component.html',
  styleUrl: './invalid-input-feedback.component.css'
})
export class InvalidInputFeedbackComponent {
  show = input(false);
  text = input("invalid input")
}
