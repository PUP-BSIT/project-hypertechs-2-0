import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
<<<<<<< HEAD
export class RecoveryComponent {
  currentStep: string = 'enterOtp';
=======
export class RecoveryComponent implements OnInit {
  themeIcon: string = 'dark_mode';
  currentStep: string = 'enterEmail';
>>>>>>> 70744bfb85ac8c4036d68aa6e254c91446a6bf6b

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
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
