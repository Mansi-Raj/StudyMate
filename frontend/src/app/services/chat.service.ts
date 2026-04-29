import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/chat'; // Your future Spring Boot URL

  // BehaviorSubject to keep track of the current conversation state
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor() { }

  sendMessage(content: string): Observable<ChatMessage> {
    const userMsg: ChatMessage = { role: 'user', content, timestamp: new Date() };
    
    // Optimistically add user message to the UI
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMsg]);

    // Make the actual call to Spring Boot
    return this.http.post<ChatMessage>(this.apiUrl, { prompt: content }).pipe(
      tap(aiResponse => {
        // When Gemini/Spring Boot replies, add it to the chat
        const updatedMessages = this.messagesSubject.value;
        this.messagesSubject.next([...updatedMessages, aiResponse]);
      })
    );
  }
}