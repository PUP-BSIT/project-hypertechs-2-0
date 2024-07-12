import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { OtpverificationService } from '../../../../services/otp/otpverification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ThemeService } from '../../../../services/theme/theme.service';
import { DialogService } from '../../../../services/dialog/dialog.service';

@Component({
  selector: 'app-enter-new-password',
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['../recovery.component.scss']
})
export class EnterNewPasswordComponent implements OnInit {
  @Output() passwordSubmitted = new EventEmitter<string>();
  user_id: string = '';
  resetForm: FormGroup = this.fb.group({});
  themeIcon: string = 'dark_mode';
  isLoading = false;

  constructor(
    private otpService: OtpverificationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private userService: UserService,
    private themeService: ThemeService,
    private dialogService: DialogService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initializeTheme();
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
    });
    this.resetForm = this.fb.group(
      {
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
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  private initializeTheme() {
    this.themeService.currentTheme.subscribe((isDark) => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });
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
      const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      return !passwordValid ? { passwordComplexity: true } : null;
    };
  }

  matchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (abstractControl: AbstractControl): { [key: string]: any } | null => {
      const ctrlPassword = abstractControl.get(password);
      const ctrlConfirmPassword = abstractControl.get(confirmPassword);
      if (ctrlConfirmPassword?.errors && !ctrlConfirmPassword.errors['confirmedValidator']) {
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
    if (!this.resetForm.valid) return;
    this.isLoading = true;

    const password = this.resetForm.get('password')?.value;

    this.otpService.resetPassword(this.user_id, password)
      .subscribe(response => {
        this.isLoading = false;
        if (response.status === 'success') {
          localStorage.setItem('loggedInUser', JSON.stringify(response));
          this.userService.setFirstname(response.firstname);
          this.userService.setLastname(response.lastname);
          this.userService.setEmail(response.email);
          this.handleSuccess(response);
          this.isLoading = false;
        } else {
          this.snackbarService.show(response.message, 'Try again');
        }
      }, error => {
        this.isLoading = false;
        this.snackbarService.show('Failed to reset password', 'Try again');
      });
  }

  private handleSuccess(response: any) {
    const dialogRef = this.dialogService.openSuccessDialog(
      'Reset Password Successful!',
      'Welcome back to Scribe! Redirecting you to your home page...'
    );
    setTimeout(() => {
      dialogRef.close();
      this.router.navigate(['/main']);
    }, 3000);
  }
}
