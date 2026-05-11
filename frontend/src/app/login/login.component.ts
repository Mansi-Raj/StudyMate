import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isRegistering = false; // A toggle switch to alternate between Login UI and Register UI
  
  private authService = inject(AuthService);
  private router = inject(Router);

  // Triggered when the user clicks 'Sign In' or 'Sign Up'
  onSubmit() {
    // Basic frontend validation
    if (!this.username || !this.password) {
      alert('Please enter both username and password.');
      return;
    }

    const credentials = { username: this.username, password: this.password };

    // Registration Flow
    if (this.isRegistering) {
      this.authService.register(credentials).subscribe({
        next: () => {
          alert('Registration successful! Please log in.');
          this.isRegistering = false; // Flip them back to the login view automatically
        },
        error: (err) => alert(err.error || 'Registration failed')
      });
    } 
    // Login Flow
    else {
      this.authService.login(credentials).subscribe({
        next: () => this.router.navigate(['/chat']), // On success, redirect to the protected chat route
        error: () => alert('Invalid username or password')
      });
    }
  }
}