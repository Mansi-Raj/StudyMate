import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// A Guard protects routes from being accessed by unauthorized users
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If they have a token, let them through
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // If they don't, kick them back to the login page
    router.navigate(['/login']);
    return false;
  }
};