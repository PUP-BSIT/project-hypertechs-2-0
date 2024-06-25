import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

/* Services */
import { ThemeService } from '../../../services/theme/theme.service';
import { UserService } from '../../../services/user/user.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';
import { ToolbarService } from '../../../services/toolbar/toolbar.service';
import { SidenavService } from '../../../services/sidenav/sidenav.service';
import { simpleFade, slideInOut } from '../../../animations/element-animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [simpleFade, slideInOut],
})
export class MainComponent implements OnInit {
  isOpened = false;
  toolbarVisible: boolean = true;
  themeIcon: string = 'dark_mode';
  showCancelButton: boolean = false;
  previousUrl: string | null = null;

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
  ) {
    // Listen to route changes to track the previous route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url !== '/main/search') {
          this.previousUrl = event.url;
        }
      }
    });
  }

  ngOnInit() {
    this.sidenavService.isOpened$.subscribe((isOpened) => {
      this.isOpened = isOpened; // Update isOpened based on sidenav service
    });

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

  /* Search bar behavior */
  onSearchFocus() {
    this.router.navigate(['/main/search']);
    this.showCancelButton = true;
    setTimeout(() => {
      const cancelText = document.querySelector('.cancel-text') as HTMLElement;
      if (cancelText) {
        cancelText.classList.add('visible');
      }
    }, 0);
  }

  onSearchBlur() {
    setTimeout(() => {
      // Check if the search component is still present
      const searchComponent = document.querySelector(
        '.search-component'
      ) as HTMLElement;
      if (searchComponent && searchComponent.style.display !== 'none') {
        return; // If search component is still present, do not hide cancel
      }

      // If search component is not present, hide cancel button when not clicked
      if (!this.showCancelButton) {
        const cancelText = document.querySelector(
          '.cancel-text'
        ) as HTMLElement;
        if (cancelText) {
          cancelText.classList.remove('visible');
        }
      }
    }, 100);
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showCancelButton = input.value.length > 0;
  }

  onCancelSearch() {
    const searchInput = document.getElementById(
      'search_input'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
      searchInput.blur();
      this.showCancelButton = false;
      const cancelText = document.querySelector('.cancel-text') as HTMLElement;
      if (cancelText) {
        cancelText.classList.remove('visible');
      }
      if (this.previousUrl) {
        this.router.navigate([this.previousUrl]);
      }
    }
  }

  private initializeToolbar() {
    this.toolbarService.toolbarVisible$.subscribe((visible) => {
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
