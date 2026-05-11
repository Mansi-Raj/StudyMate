import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Requires RouterOutlet to function as a layout host
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'StudyMate - AI Study Assistant';
}