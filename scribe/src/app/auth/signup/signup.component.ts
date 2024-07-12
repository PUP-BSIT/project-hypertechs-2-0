import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SignupData } from '../../../models/model';
import { UserService } from '../../../services/user/user.service';
import { SignupService } from '../../../services/signup/signup.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { AuthService } from '../../../services/auth/auth.service';
import { slideLeftRightSteps } from '../../../animations/element-animations';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [slideLeftRightSteps],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = this.formBuilder.group({});
  errorMessage: string = '';
  isLoading = false;
  currentStep = 1;
  themeIcon: string = 'dark_mode';

  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogService: DialogService,
    private authService: AuthService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        lastname: ['', [Validators.required, this.nameValidator()]],
        firstname: ['', [Validators.required, this.nameValidator()]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40),
            this.passwordComplexityValidator(),
          ],
        ],
        confirm_password: ['', [Validators.required]],
      },
      { validators: this.matchValidator('password', 'confirm_password') }
    );

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

  get lastnameControl() {
    return this.signupForm.get('lastname');
  }

  get firstnameControl() {
    return this.signupForm.get('firstname');
  }

  get emailControl() {
    return this.signupForm.get('email');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }

  get confirmPasswordControl() {
    return this.signupForm.get('confirm_password');
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
  
      if (!value) {
        return null;
      }
  
      const isWhitespace = value.trim().length === 0;
      const isNumbersOnly = /^[0-9]*$/.test(value);
      const isSpacesAndNumbersOnly = /^[\s0-9]+$/.test(value);
  
      if (isWhitespace || isNumbersOnly || isSpacesAndNumbersOnly) {
        return { invalidName: true };
      }
  
      return null;
    };
  }

  passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

      return !passwordValid
        ? { passwordComplexity: 'Password does not meet complexity requirements' }
        : null;
    };
  }

  matchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (abstractControl: AbstractControl): { [key: string]: any } | null => {
      const ctrlPassword = abstractControl.get(password);
      const ctrlConfirmPassword = abstractControl.get(confirmPassword);

      if (
        ctrlConfirmPassword?.errors &&
        !ctrlConfirmPassword.errors['confirmedValidator']
      ) {
        return null;
      }

      if (ctrlPassword?.value !== ctrlConfirmPassword?.value) {
        ctrlConfirmPassword?.setErrors({ confirmedValidator: true });
        return { confirmedValidator: true };
      } else {
        ctrlConfirmPassword?.setErrors(null);
        return null;
      }
    };
  }

  onSubmit() {
    if (!this.signupForm.valid) return;
    this.isLoading = true;

    const signupData: SignupData = {
      lastname: this.lastnameControl?.value,
      firstname: this.firstnameControl?.value,
      email: this.emailControl?.value,
      password: this.passwordControl?.value,
    };

    this.signupService.signupUser(signupData).subscribe({
      next: (response) => {
        //localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.userService.setFirstname(signupData.firstname);
        this.userService.setLastname(signupData.lastname);
        this.userService.setEmail(signupData.email);
        this.userService.setUserId(response.user_id);
        this.authService.setUserId(response.user_id); // Notify AuthService
        this.openSentmailDialog();
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
      this.errorMessage = 'You are currently offline';
      return;
    }

    if (error.error && error.error.error) {
      this.errorMessage = error.error.error;
      return;
    }

    switch (error.status) {
      case 400:
        this.errorMessage = 'This email has already been used. Use a new one.';
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

  openSentmailDialog(): void {
    const dialogRef = this.dialogService.openDialog({
      title: 'Email Verification',
      content: 'We sent an OTP code to your email to verify your identity.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
      action: 'ok',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        const user_id = this.authService.getUserId();
        this.router.navigate(['otp'], {
          queryParams: { user_id: user_id },
        });
      }
    });
  }

  next() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  back() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
