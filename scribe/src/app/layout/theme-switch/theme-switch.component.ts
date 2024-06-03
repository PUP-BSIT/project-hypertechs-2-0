import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss'
})
export class ThemeSwitchComponent {
  isDarkMode!: boolean; // Variable to hold the current theme state

  // Inject ThemeService into the component
  constructor(private themeService: ThemeService) {
    // Subscribe to the current theme observable to keep track of theme changes
    this.themeService.currentTheme.subscribe(isDark => this.isDarkMode = isDark);
  }

  // Method to toggle the theme between light and dark
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}