import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['../recovery.component.scss'],
})
export class EnterOtpComponent {
  otp: string[] = new Array(6).fill('');
  otpErrorMessage: string = '';
  
  @Output() otpSubmitted: EventEmitter<string> = new EventEmitter<string>();

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

    this.otpSubmitted.emit(otpValue);
  }
}