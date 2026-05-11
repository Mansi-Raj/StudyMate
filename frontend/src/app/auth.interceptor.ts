import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

// An Interceptor acts like a middleware for outgoing HTTP requests from Angular to Spring Boot
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Fetch the token from LocalStorage

  // If a token exists (user is logged in), clone the request and forcibly attach the token to the header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // This matches exactly what our Spring Boot filter is looking for
      }
    });
    // Send the modified request
    return next(cloned);
  }
  
  // If no token exists (e.g., they are trying to log in), just send the request as normal
  return next(req);
};