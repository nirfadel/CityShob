import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}