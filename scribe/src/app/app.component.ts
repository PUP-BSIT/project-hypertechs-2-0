import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from '../services/theme.service'
import { RouterOutlet } from '@angular/router';
import { RouteTransitionAnimations } from '../animations/route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [RouteTransitionAnimations]
})
export class AppComponent {
  title = 'scribe';

  constructor(private themeService: ThemeService, private renderer: Renderer2) {

    this.themeService.currentTheme.subscribe(isDarkMode => {
      if (isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode');
      }
    });

    /* Apply the initial theme on load (dark theme) */
    const isDarkMode = this.themeService.getCurrentTheme();
    if (isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  /* Add route transitions to the root component */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && 
      outlet.activatedRouteData && 
      outlet.activatedRouteData['animationState'];
   }
}
