import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OtpverificationService } from '../../../services/otp/otpverification.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { UserService } from '../../../services/user/user.service';
import { simpleFade } from '../../../animations/element-animations';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  animations: [simpleFade],
})
export class OtpComponent {
  themeIcon: string = 'dark_mode';
  otp: string[] = new Array(6).fill('');
  otpErrorMessage: string = '';
  userId: string = '';
  isLoading = false;

  @Output() otpSubmitted: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private otpService: OtpverificationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private themeService: ThemeService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeTheme();
    this.route.queryParams.subscribe((params) => {
      this.userId = params['user_id'];
      //console.log('User ID:', this.userId);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  private initializeTheme() {
    this.themeService.currentTheme.subscribe((isDark) => {
      this.themeIcon = isDark ? 'dark_mode' : 'light_mode';
    });
  }

  onOtpInput(index: number, event: any) {
    const value = event.target.value;
    if (!/^\d$/.test(value)) {
      event.target.value = '';
      return;
    }

    this.otp[index - 1] = value;

    if (value && index < 6) {
      const nextInput = event.target.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onSubmit() {
    const otpValue = this.otp.join('');
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      this.otpErrorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.otpService.verifyOtp(otpValue).subscribe(
      (response) => {
        if (response.status === 'success') {
          localStorage.setItem('loggedInUser', JSON.stringify(response));
          this.handleSuccess(response);
        } else {
          this.handleError(response.message || 'Received OTP is incorrect');
        }
      },
      (error) => {
        this.handleError('An error occurred. Please try again.');
      }
    );
  }

  resendOtp(): void {
    this.isLoading = true;
    this.otpService.resendOtp(this.userId).subscribe({
      next: (response) => {
        //console.log('Response from server: ', response);
        this.userService.setFirstname(response.firstname);
        this.userService.setLastname(response.lastname);
        this.userService.setEmail(response.email);
        //console.log(response.user_id);
        this.openSentmailDialog(response.user_id);
        this.isLoading = false;
        this.snackbarService.dismiss();
      },
    });
  }

  openSentmailDialog(user_id: string): void {
    const dialogRef = this.dialogService.openDialog({
      title: 'OTP Resent',
      content: 'We sent an OTP code to your email to verify your identity.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
      action: 'ok',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        //const user_id = this.authService.getUserId();
        this.router.navigate(['otp'], {
          queryParams: { user_id: user_id },
        });
      }
    });
  }

  private handleSuccess(response: any) {
    const dialogRef = this.dialogService.openSuccessDialog(
      'Sign Up successful!',
      'Welcome to Scribe! Redirecting you to your home page...'
    );
    setTimeout(() => {
      dialogRef.close();
      this.router.navigate(['/main']);
    }, 3000);
  }

  private handleError(message: string) {
    this.snackbarService.show(message);
  }
}
