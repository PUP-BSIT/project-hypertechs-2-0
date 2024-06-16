import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    const storedUser = localStorage.getItem('loggedInUser');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
