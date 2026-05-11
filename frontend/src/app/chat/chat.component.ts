import { Component, inject, ElementRef, ViewChild, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  title = 'StudyMate - AI Study Assistant';
  userInput: string = '';
  isLoading: boolean = false;
  
  // Dependency Injections
  chatService = inject(ChatService);
  cdr = inject(ChangeDetectorRef); // Used to manually trigger UI updates during the typing effect
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Array to hold the conversation history
  messages: { role: string, content: string, rawContent?: string }[] = [];

  // Grabs a reference to the DOM element holding the messages so we can scroll it
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  ngOnInit() {
    // Subscribe to existing chat history upon initialization
    this.chatService.messages$.subscribe(history => {
      if (this.messages.length === 0 && history) {
        this.messages = [...history];
      }
    });
  }

  // Fires after every view render to ensure the chat stays pinned to the bottom
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  // Lightweight Markdown to HTML parser for styling AI responses
  formatMarkdown(text: string): string {
    let html = text;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-3 mb-1 text-gray-800">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-900">$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>');
    html = html.replace(/\n/gim, '<br>');
    return html;
  }

  // Triggered when user hits 'Send'
  onSubmit() {
    if (!this.userInput.trim()) return; // Ignore empty messages

    const query = this.userInput;
    this.userInput = ''; 
    this.isLoading = true; // Show typing indicator

    // Instantly append user's message to the UI
    this.messages.push({ role: 'user', content: query });
    this.cdr.detectChanges(); 

    // Make the API call to the backend
    this.chatService.sendMessage(query).subscribe({
      next: (response: any) => { 
        this.isLoading = false; // Hide typing indicator
        const fullText = response.content || ""; 
        
        // Setup an empty message block for the AI response
        this.messages.push({ role: 'ai', content: '', rawContent: '' });
        const targetIndex = this.messages.length - 1;

        // Splitting text by words to create the typing effect
        const words = fullText.split(/(\s+)/);
        let currentWordIndex = 0;
        const typingSpeed = 30; // Milliseconds per word

        // An interval loop to append words one-by-one
        const typingInterval = setInterval(() => {
          if (currentWordIndex < words.length) {
            // Add raw text
            this.messages[targetIndex].rawContent += words[currentWordIndex];
            // Format to HTML live
            this.messages[targetIndex].content = this.formatMarkdown(this.messages[targetIndex].rawContent!);
            
            currentWordIndex++;
            this.cdr.detectChanges(); // Force UI to update with the new word
          } else {
            clearInterval(typingInterval); // Stop the loop when done
          }
        }, typingSpeed);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.messages.push({ role: 'ai', content: 'Network error!' });
        this.cdr.detectChanges();
      }
    });
  }

  // Wipes the token and kicks user back to the login screen
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}