import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private firstnameSubject = new BehaviorSubject<string | null>(null);
  private lastnameSubject = new BehaviorSubject<string | null>(null);
  private emailSubject = new BehaviorSubject<string | null>(null);
  private userIdSubject = new BehaviorSubject<number | null>(null);

  firstname$ = this.firstnameSubject.asObservable();
  lastname$ = this.lastnameSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();

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

  setUserId(userId: number) {
    this.userIdSubject.next(userId);
    localStorage.setItem('user_id', userId.toString());
  }

  getUserId(): number | null {
    if (this.userIdSubject.getValue() === null) {
      const storedUserId = localStorage.getItem('user_id');
      this.userIdSubject.next(storedUserId ? parseInt(storedUserId, 10) : null);
    }
    return this.userIdSubject.getValue();
  }

  isLoggedIn(): boolean {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return loggedInUser !== null;
  }
}
