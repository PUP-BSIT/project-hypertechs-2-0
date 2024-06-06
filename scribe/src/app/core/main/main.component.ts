import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = 
    this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Dynamically change icon based on theme
  themeIcon: string = 'dark_mode';

  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    this.themeService.currentTheme.subscribe(isDark => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
