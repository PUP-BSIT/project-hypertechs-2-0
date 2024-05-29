import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(this.getInitialTheme());
  currentTheme = this.darkTheme.asObservable();

  toggleTheme() {
    const isDarkMode = !this.darkTheme.value;
    this.darkTheme.next(isDarkMode);
    localStorage.setItem('isDarkMode', isDarkMode.toString());
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme === 'true' ? true : false;
  }

  getCurrentTheme(): boolean {
    return this.darkTheme.getValue();
  }
}
