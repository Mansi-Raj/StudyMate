import { Component, inject, ElementRef, ViewChild, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service'; // Added for logout

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html', // Updated to point to chat HTML
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  title = 'StudyMate - AI Study Assistant';
  userInput: string = '';
  isLoading: boolean = false;
  
  chatService = inject(ChatService);
  cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService); // Added for logout
  private router = inject(Router);           // Added for logout
  
  messages: { role: string, content: string, rawContent?: string }[] = [];

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  ngOnInit() {
    this.chatService.messages$.subscribe(history => {
      if (this.messages.length === 0 && history) {
        this.messages = [...history];
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  formatMarkdown(text: string): string {
    let html = text;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-3 mb-1 text-gray-800">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-900">$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>');
    html = html.replace(/\n/gim, '<br>');
    return html;
  }

  onSubmit() {
    if (!this.userInput.trim()) return;

    const query = this.userInput;
    this.userInput = ''; 
    this.isLoading = true;

    this.messages.push({ role: 'user', content: query });
    this.cdr.detectChanges(); 

    this.chatService.sendMessage(query).subscribe({
      next: (response: any) => { // Added :any to prevent type errors depending on your service setup
        this.isLoading = false;
        const fullText = response.content || ""; 
        
        this.messages.push({ role: 'ai', content: '', rawContent: '' });
        const targetIndex = this.messages.length - 1;

        const words = fullText.split(/(\s+)/);
        let currentWordIndex = 0;
        
        const typingSpeed = 30; 

        const typingInterval = setInterval(() => {
          if (currentWordIndex < words.length) {
            this.messages[targetIndex].rawContent += words[currentWordIndex];
            this.messages[targetIndex].content = this.formatMarkdown(this.messages[targetIndex].rawContent!);
            
            currentWordIndex++;
            this.cdr.detectChanges(); 
          } else {
            clearInterval(typingInterval);
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

  // Handle exiting the protected route
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}