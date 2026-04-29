import { Component, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewChecked {
  title = 'Clariva - AI Study Assistant';
  userInput: string = '';
  isLoading: boolean = false;
  
  chatService = inject(ChatService);
  messages$ = this.chatService.messages$;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onSubmit() {
    if (!this.userInput.trim()) return;

    const query = this.userInput;
    this.userInput = ''; // clear input immediately
    this.isLoading = true;

    this.chatService.sendMessage(query).subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        console.error('Error communicating with backend', err);
        this.isLoading = false;
      }
    });
  }
}