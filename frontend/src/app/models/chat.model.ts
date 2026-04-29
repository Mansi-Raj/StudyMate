export interface ChatMessage {
  id?: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}