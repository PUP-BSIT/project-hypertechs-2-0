import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OtpverificationService } from '../../../services/otp/otpverification.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ThemeService } from '../../../services/theme/theme.service';
import { DialogService } from '../../../services/dialog/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  themeIcon: string = 'dark_mode';
  otp: string[] = new Array(6).fill('');
  otpErrorMessage: string = '';
  userId: string = '';

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

    this.route.queryParams.subscribe(params => {
      this.userId = params['user_id'];
      console.log('User ID:', this.userId);
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
      // Clear invalid input
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

  resendOtp():void{
    this.otpService.resendOtp(this.userId).subscribe({
      next: (response) => {
        console.log('Response from server: ', response);
        this.userService.setFirstname(response.firstname);
        this.userService.setLastname(response.lastname);
        this.userService.setEmail(response.email);
        console.log(response.user_id);
        this.openSentmailDialog();
        this.snackbarService.dismiss();
      },
    });
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

  private handleSuccess(response: any) {
    
    this.router.navigate(['/main']);
  }


  // private handleSuccess(response: any) {
  //   const user_id = this.authService.getUserId();
  //   this.router.navigate(['/enter-new-password'], {
  //     queryParams: { user_id: user_id },
  //   });
  //   //TODO testing
  //   console.log(user_id);
  // }

  private handleError(message: string) {
    this.snackbarService.show(message);
  }
}
