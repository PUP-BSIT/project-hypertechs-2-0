import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from '../services/theme.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scribe';

  // Inject ThemeService and Renderer2 into the component
  constructor(private themeService: ThemeService, private renderer: Renderer2) {
    /* Subscribe to the current theme observable to apply the correct 
    /theme class to the body element */
    this.themeService.currentTheme.subscribe(isDarkMode => {
      if (isDarkMode) {
        // Add 'dark-mode' class when dark theme is active
        this.renderer.addClass(document.body, 'dark-mode');
      } else {
        // Remove 'dark-mode' class when light theme is active
        this.renderer.removeClass(document.body, 'dark-mode');
      }
    });

    // Apply the initial theme on load (dark theme)
    const isDarkMode = this.themeService.getCurrentTheme();
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }
}
