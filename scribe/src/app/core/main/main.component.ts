import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit{
  private breakpointObserver = inject(BreakpointObserver);
  email: string | null = null;
  firstname: string = '';

  isHandset$: Observable<boolean> = 
    this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Dynamically change icon based on theme
  themeIcon: string = 'dark_mode';

  constructor(private themeService: ThemeService, private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit() {
    this.themeService.currentTheme.subscribe(isDark => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });

    this.firstname = this.route.snapshot.queryParams['firstname'];
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  logout() {
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['/login']); // Redirect to login page
  }
}