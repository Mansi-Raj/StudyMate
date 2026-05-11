import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

// The main configuration file for the Angular 17+ standalone app
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Enables the routing system
    
    // Enables HTTP calls and registers our custom interceptor to run on every request
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};