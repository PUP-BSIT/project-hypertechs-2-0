import { Component, Renderer2  } from '@angular/core';
import { ThemeService } from '../services/theme.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scribe-app';

  constructor(private themeService: ThemeService, private renderer: Renderer2) {
    this.themeService.currentTheme.subscribe(isDarkMode => {
      if (isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode');
      }
    });

    // Apply the initial theme on load
    const isDarkMode = this.themeService.getCurrentTheme();
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }
}
