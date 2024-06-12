import { Component } from '@angular/core';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent {
  currentStep: string = 'enterOtp';

  handleEmailSubmitted(email: string) {
    console.log('Email submitted:', email);
    // TODO: Add logic to validate email and transition to the OTP step
    this.currentStep = 'enterOtp';
  }

  handleOtpSubmitted(otp: string) {
    console.log('OTP submitted:', otp);
    // TODO: Add logic to validate OTP and transition to the new password step
    this.currentStep = 'enterNewPassword';
  }

  handlePasswordSubmitted(newPassword: string) {
    console.log('New password submitted:', newPassword);
    // TODO: Add logic to handle new password submission
  }
}
