import { Component, inject, ElementRef, ViewChild, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'StudyMate - AI Study Assistant';
  userInput: string = '';
  isLoading: boolean = false;
  
  chatService = inject(ChatService);
  cdr = inject(ChangeDetectorRef);
  
  // Notice we added 'rawContent' to track the unformatted text while typing
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

  // A lightweight function to turn Markdown into actual HTML
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
      next: (response) => {
        this.isLoading = false;
        const fullText = response.content || ""; 
        
        // Push an empty message, setting rawContent to empty string
        this.messages.push({ role: 'ai', content: '', rawContent: '' });
        const targetIndex = this.messages.length - 1;

        // Split the text by spaces, but keep the spaces in the array
        const words = fullText.split(/(\s+)/);
        let currentWordIndex = 0;
        
        // Much faster speed! (30ms per word instead of per character)
        const typingSpeed = 30; 

        const typingInterval = setInterval(() => {
          if (currentWordIndex < words.length) {
            
            // Add the next word to the raw string
            this.messages[targetIndex].rawContent += words[currentWordIndex];
            
            // Format the string into HTML and apply it to the screen
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
}