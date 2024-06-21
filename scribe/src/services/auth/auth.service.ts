import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: number | null = null;
  private userSubject = new BehaviorSubject<number | null>(this.userId);

  user$ = this.userSubject.asObservable();

  constructor() {
    // Initialize userId from localStorage when the service is created
    this.initializeUserId();
  }

  private initializeUserId(): void {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      this.userSubject.next(this.userId);
    }
  }

  setUserId(userId: number): void {
    this.userId = userId;
    localStorage.setItem('user_id', userId.toString());
    this.userSubject.next(userId); // Notify subscribers of the user change
  }

  getUserId(): number | null {
    return this.userId;
  }

  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem('user_id');
    this.userSubject.next(null); // Notify subscribers of the user change
  }

  logout() {
    this.clearUserId();
    localStorage.removeItem('loggedInUser');
  }
}
