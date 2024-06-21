import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storedUser = localStorage.getItem('loggedInUser');

  if (storedUser) {
    return true;
  }

  // User is not logged in, redirect to login
  router.navigate(['/login']);
  return false;
};
