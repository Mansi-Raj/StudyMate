import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  // Public Route
  { path: 'login', component: LoginComponent },
  
  // Protected Route: Angular checks authGuard before rendering ChatComponent
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  
  // Base path redirects to chat (which will kick them to login if unauthenticated)
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  
  // Catch-all for typos in the URL
  { path: '**', redirectTo: '/login' }
];