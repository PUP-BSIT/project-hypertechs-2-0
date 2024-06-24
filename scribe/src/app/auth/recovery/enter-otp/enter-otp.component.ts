import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OtpverificationService } from '../../../../services/otp/otpverification.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['../recovery.component.scss'],
})
export class EnterOtpComponent {
  otp: string[] = new Array(6).fill('');
  otpErrorMessage: string = '';
  
  @Output() otpSubmitted: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private otpService: OtpverificationService, 
    private router: Router, 
    private snackbarService: SnackbarService,
    private authService: AuthService
  ){}

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

    //this.otpSubmitted.emit(otpValue);

    this.otpService.verifyOtp(otpValue).subscribe(
      response => {
        if (response.status === 'success') {
          this.handleSuccess(response);
        } else {
          this.handleError(response.message || 'Received OTP is incorrect');
        }
      },
      error => {
        this.handleError('An error occurred. Please try again.');
      }
    );
  }

  private handleSuccess(response: any) {
    const user_id = this.authService.getUserId();
    this.router.navigate(['/enter-new-password'], { queryParams: { user_id: user_id } });
    //TODO testing
    console.log(user_id);
  }

  private handleError(message: string) {
    this.snackbarService.show(message);
  }
}
