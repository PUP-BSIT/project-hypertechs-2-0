import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

/* Services */
import { ThemeService } from '../../../services/theme/theme.service';
import { UserService } from '../../../services/user/user.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';
import { ToolbarService } from '../../../services/toolbar/toolbar.service';
import { SidenavService } from '../../../services/sidenav/sidenav.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isOpened = false;
  toolbarVisible: boolean = true;
  themeIcon: string = 'dark_mode';

  email: string | null = null;
  firstname: string | null = null;
  lastname: string | null = null;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService,
    private titleCaseService: TitleCaseService,
    private toolbarService: ToolbarService,
    private sidenavService: SidenavService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.sidenavService.isOpened$.subscribe(isOpened => {
      this.isOpened = isOpened; // Update isOpened based on sidenav service
    });

    // Initialize other components as needed
    this.initializeToolbar();
    this.initializeTheme();
    this.initializeUserData();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['']);
  }

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
        this.logout();
      }
    });
  }

  private initializeToolbar() {
    this.toolbarService.toolbarVisible$.subscribe(visible => {
      this.toolbarVisible = visible;
    });
  }

  private initializeTheme() {
    this.themeService.currentTheme.subscribe((isDark) => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });
  }

  private initializeUserData() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.userService.setFirstname(userData.firstname);
        this.userService.setLastname(userData.lastname);
        this.userService.setEmail(userData.email);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('loggedInUser');
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
}
