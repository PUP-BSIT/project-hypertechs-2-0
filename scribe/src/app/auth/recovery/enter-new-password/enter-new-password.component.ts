import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-enter-new-password',
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['../recovery.component.scss']
})
export class EnterNewPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  @Output() passwordSubmitted = new EventEmitter<string>();

  passwordError: boolean = false;
  confirmPasswordError: boolean = false;

  onSubmit() {
    this.passwordError = false;
    this.confirmPasswordError = false;

    if (this.newPassword.length < 8) {
      this.passwordError = true;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = true;
      return;
    }

    console.log('Password reset successfully');
    this.passwordSubmitted.emit(this.newPassword);
  }
}