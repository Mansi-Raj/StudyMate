import { Routes } from '@angular/router';

// Guards
import { authGuard } from './guards/auth.guard';

// Components
import { ChatComponent } from './chat/chat.component'; 
import { LoginComponent } from './login/login.component'; 

export const routes: Routes = [
  // Public route for login
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // Protected route for chat
  { 
    path: 'chat', 
    component: ChatComponent, 
    canActivate: [authGuard] 
  },

  // Default route (redirects to chat if authenticated, otherwise guard will send to login)
  { 
    path: '', 
    redirectTo: '/chat', 
    pathMatch: 'full' 
  },

  // Catch-all route for undefined paths (404 handling)
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];