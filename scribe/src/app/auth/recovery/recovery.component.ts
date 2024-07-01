import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent implements OnInit {
  themeIcon: string = 'dark_mode';
  currentStep: string = 'enterEmail';

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