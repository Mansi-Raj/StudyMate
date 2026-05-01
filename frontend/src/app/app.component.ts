import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Only need RouterOutlet here
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'StudyMate - AI Study Assistant';
}