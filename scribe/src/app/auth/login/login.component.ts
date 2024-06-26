import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginData } from '../../../models/model';
import { UserService } from '../../../services/user/user.service';
import { LoginService } from '../../../services/login/login.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  isLoading = false;
  themeIcon: string = 'dark_mode';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private themeService: ThemeService,
  ) {}

  loginForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, this.customEmailValidator()],
      ],
      password: ['', Validators.required],
    });

    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.userService.setFirstname(userData.firstname);
        this.userService.setLastname(userData.lastname);
        this.userService.setEmail(userData.email);
        this.userService.setUserId(userData.user_id);
        this.router.navigate(['main']);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('loggedInUser');
      }
    }

    this.initializeTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  private initializeTheme() {
    this.themeService.currentTheme.subscribe((isDark) => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const email = control.value as string;
      const emailRegex =
        /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}))$/;

      if (emailRegex && !emailRegex.test(email)) {
        return { invalidEmail: true };
      } else {
        return null;
      }
    };
  }

  onSubmit() {
    if (!this.loginForm.valid) return;
    this.isLoading = true;

    const loginData: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    console.log('Data sent to service: ', loginData);

    this.loginService.loginUser(loginData).subscribe({
      next: (response) => {
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.userService.setFirstname(response.firstname);
        this.userService.setLastname(response.lastname);
        this.userService.setEmail(response.email);
        this.authService.setUserId(response.user_id); // Notify AuthService
        this.router.navigate(['main']);
        this.isLoading = false;
        this.snackbarService.dismiss();
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
        this.isLoading = false;
      },
    });
  }

  handleError(error: HttpErrorResponse | Error) {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleNetworkError();
    }
    this.snackbarService.show(this.errorMessage);
  }

  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.errorMessage = 'You are currently offline.';
      return;
    }

    if (error.error && error.error.error) {
      this.errorMessage = error.error.error;
      return;
    }

    switch (error.status) {
      case 400:
        this.errorMessage = 'Bad request. Please check your data.';
        break;
      case 401:
        this.errorMessage = 'You have entered an invalid email or password.';
        break;
      case 500:
        this.errorMessage = 'Internal server error. Please try again later.';
        break;
      default:
        this.errorMessage = `Error: ${error.status}. Please try again later.`;
    }
  }

  private handleNetworkError() {
    this.errorMessage =
      'Network error occurred. Please check your internet connection.';
  }
}
