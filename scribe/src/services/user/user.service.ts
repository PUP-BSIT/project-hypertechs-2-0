import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Make the service available throughout the application
})
export class UserService {

  private firstnameSubject = new BehaviorSubject<string | null>(null);
  private lastnameSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);

  firstname$ = this.firstnameSubject.asObservable();
  lastname$ = this.lastnameSubject.asObservable();
  email$ = this.emailSubject.asObservable();

  constructor() { }

  setFirstname(firstname: string) {
    this.firstnameSubject.next(firstname);
  }

  getFirstname(): string | null {
    return this.firstnameSubject.getValue();
  }

  setLastname(lastname: string) {
    this.lastnameSubject.next(lastname);
  }

  getLastname(): string | null {
    return this.lastnameSubject.getValue();
  }

  setEmail(email: string) {
    this.emailSubject.next(email);
  }

  getEmail(): string | null {
    return this.emailSubject.getValue();
  }

  isLoggedIn(): boolean {
    // Replace this with your actual login state checking logic
    const loggedInUser = localStorage.getItem('loggedInUser');
    return loggedInUser !== null; // Check if a logged-in user exists in session storage
  }

}