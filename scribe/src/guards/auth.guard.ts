import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const storedUser = localStorage.getItem('loggedInUser');

    if (storedUser) {
      return true;
    }

    // User is not logged in, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
