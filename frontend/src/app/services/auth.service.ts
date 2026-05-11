import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// The central hub for managing authentication state in the frontend
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Pointer to our Spring Boot backend
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'jwt_token';

  // Calls the /login endpoint
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      // 'tap' lets us perform a side-effect (saving the token) without altering the response data
      tap((response: any) => {
        if (response && response.jwt) {
          this.setToken(response.jwt); // Save to LocalStorage upon success
        }
      })
    );
  }

  // Calls the /register endpoint
  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  // Helper method to safely store the token in the browser's memory
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Helper method to retrieve the token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Wipes the token, effectively logging the user out
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Quick boolean check to see if a user is currently logged in
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }
}