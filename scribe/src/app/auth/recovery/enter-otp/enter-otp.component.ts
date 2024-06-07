import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss']
})
export class EnterOtpComponent {
  otp: string = '';
  @Output() otpSubmitted = new EventEmitter<string>();

  submitOtp() {
    this.otpSubmitted.emit(this.otp);
  }
}
