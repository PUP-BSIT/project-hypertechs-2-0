import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-enter-new-password',
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['./enter-new-password.component.scss']
})
export class EnterNewPasswordComponent {
  newPassword: string = '';
  @Output() passwordSubmitted = new EventEmitter<string>();

  submitPassword() {
    this.passwordSubmitted.emit(this.newPassword);
  }
}
