import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ThemeService } from '../../../services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit{
  private breakpointObserver = inject(BreakpointObserver);
  email: string | null = null;
  firstname: string | null = null;
  isLoggedIn: boolean = false;

  isHandset$: Observable<boolean> = 
    this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Dynamically change icon based on theme
  themeIcon: string = 'dark_mode';

  constructor(private themeService: ThemeService, private route: ActivatedRoute, private router: Router, private userService: UserService) {}
  
  ngOnInit() {
    this.themeService.currentTheme.subscribe(isDark => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });

    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.userService.setFirstname(userData.firstname); // Store firstname in service (optional)
        this.isLoggedIn = true; // Set login state
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('loggedInUser');
      }
    }

    this.userService.firstname$.subscribe(firstname => {
      this.firstname = firstname;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

}