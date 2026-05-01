import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Need FormsModule for ngModel
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    // TODO: Replace this with a real HTTP call to your Spring Boot /api/auth/login endpoint
    // For now, we are simulating a successful login so you can test the routing guard
    if (this.username && this.password) {
      const simulatedJwt = btoa(`${this.username}:fake-jwt-token`);
      this.authService.setToken(simulatedJwt);
      
      // Navigate to the protected chat route
      this.router.navigate(['/chat']);
    } else {
      alert('Please enter both username and password.');
    }
  }
}