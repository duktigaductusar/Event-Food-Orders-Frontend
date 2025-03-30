import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invalid-input-feedback',
  imports: [],
  templateUrl: './invalid-input-feedback.component.html',
  styleUrl: './invalid-input-feedback.component.css'
})
export class InvalidInputFeedbackComponent implements OnInit {
  ngOnInit(): void {
    console.log("text", this.text())
  }
  text = input("invalid input")
}
