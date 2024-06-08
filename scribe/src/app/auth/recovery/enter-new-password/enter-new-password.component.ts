import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-enter-new-password',
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['./enter-new-password.component.scss', '../recovery.component.scss']
})
export class EnterNewPasswordComponent {
  newPassword: string = '';
  @Output() passwordSubmitted = new EventEmitter<string>();
  showSuccessModal: boolean = false;

  ngOnInit() {
    this.openModal();
  }

  submitPassword() {
    console.log('Password reset successfully');

    this.showSuccessModal = true;
  }

  openModal() {
    const modal = document.getElementById('password_modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('password_modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}