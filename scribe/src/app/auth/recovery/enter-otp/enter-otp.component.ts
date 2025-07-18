import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { OtpverificationService } from '../../../../services/otp/otpverification.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { ThemeService } from '../../../../services/theme/theme.service';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { UserService } from '../../../../services/user/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['../recovery.component.scss', './enter-otp.component.scss'],
})
export class EnterOtpComponent implements OnInit {
  @ViewChild('otpInput1') otpInput1!: ElementRef;
  otp: string[] = new Array(6).fill('');
  otpErrorMessage: string = '';
  themeIcon: string = 'dark_mode';
  isLoading = false;
  userId: string = '';

  @Output() otpSubmitted: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private otpService: OtpverificationService,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private themeService: ThemeService,
    private dialogService: DialogService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeTheme();
    this.route.queryParams.subscribe((params) => {
      this.userId = params['user_id'];
    });
    setTimeout(() => {
      this.otpInput1.nativeElement.focus();
    }, 0);
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

  isOtpValid(): boolean {
    return this.otp.every((digit) => /^\d$/.test(digit));
  }

  onSubmit() {
    this.isLoading = true;
    const otpValue = this.otp.join('');
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      this.otpErrorMessage = 'Please enter a valid 6-digit OTP.';
      this.isLoading = false;
      return;
    }

    this.otpService.verifyOtp(otpValue).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.status === 'success') {
          this.handleSuccess(response);
        } else {
          this.handleError(response.message || 'Received OTP is incorrect');
        }
      },
      (error) => {
        this.isLoading = false;
        this.handleError('An error occurred. Please try again.');
      }
    );
  }

  private handleSuccess(response: any) {
    const user_id = this.authService.getUserId();
    this.router.navigate(['/enter-new-password'],{ queryParams: { user_id: user_id } });
  }

  private handleError(message: string) {
    this.snackbarService.show(message);
  }

  resendOtp(): void {
    this.isLoading = true;
    this.otpService.resendOtp(this.userId).subscribe({
      next: (response) => {
        this.userService.setFirstname(response.firstname);
        this.userService.setLastname(response.lastname);
        this.userService.setEmail(response.email);
        this.openSentmailDialog(response.user_id);
        this.isLoading = false;
        this.snackbarService.dismiss();
      },
      error: () => {
        this.handleError('An error occurred. Please try again.');
        this.isLoading = false;
      }
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
        this.router.navigate(['enter-otp'], {
          queryParams: { user_id: user_id },
        });
      }
    });
  }
}
