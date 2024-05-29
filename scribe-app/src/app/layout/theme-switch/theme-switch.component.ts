import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.css'
})
export class ThemeSwitchComponent {
  isDarkMode!: boolean;

  constructor(private themeService: ThemeService) {
    this.themeService.currentTheme.subscribe(isDark => this.isDarkMode = isDark);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
