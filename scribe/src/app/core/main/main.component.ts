import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOut, simpleFade } from '../../../animations/element-animations';

/* Services */
import { ThemeService } from '../../../services/theme/theme.service';
import { UserService } from '../../../services/user/user.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [slideInOut, simpleFade],
})
export class MainComponent implements OnInit {
  isOpened = false;

  private breakpointObserver = inject(BreakpointObserver);
  email: string | null = null;
  firstname: string | null = null;
  lastname: string | null = null;

  //isLoggedIn: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  /* Dynamically change icon based on theme */
  themeIcon: string = 'dark_mode';

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private titleCaseService: TitleCaseService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isOpened = true;
    }, 0);

    /* Subscribe the theme link to theme service */
    this.themeService.currentTheme.subscribe((isDark) => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });

    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Store firstname in service (optional)
        this.userService.setFirstname(userData.firstname);
        this.userService.setLastname(userData.lastname);
        this.userService.setEmail(userData.email);
        //this.isLoggedIn = true; // Set login state
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        sessionStorage.removeItem('loggedInUser');
      }
    }

    this.userService.firstname$.subscribe((firstname) => {
      this.firstname = this.titleCaseService.toTitleCase(firstname);
    });

    this.userService.lastname$.subscribe((lastname) => {
      this.lastname = this.titleCaseService.toTitleCase(lastname);
    });

    this.userService.email$.subscribe((email) => {
      this.email = email;
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    sessionStorage.removeItem('loggedInUser');
    this.router.navigate(['']); /* Redirect to login page */
  }

  /* Custom Dialog Content */
  openLogoutDialog(): void {
    const dialogRef = this.dialogService.openDialog({
      title: 'Confirm Logout',
      content: 'Are you sure you want to log out?',
      cancelText: 'Cancel',
      confirmText: 'Logout',
      action: 'logout',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'logout') {
        /* Perform logout action here */
        this.logout();
      }
    });
  }
}
