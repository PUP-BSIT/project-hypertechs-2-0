import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Make the service available throughout the application
})
export class UserService {

  private firstnameSubject = new BehaviorSubject<string | null>(null);
  firstname$ = this.firstnameSubject.asObservable();

  constructor() { }

  setFirstname(firstname: string) {
    this.firstnameSubject.next(firstname);
  }

  getFirstname(): string | null {
    return this.firstnameSubject.getValue();
  }

  isLoggedIn(): boolean {
    // Replace this with your actual login state checking logic
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    return loggedInUser !== null; // Check if a logged-in user exists in session storage
  }

}