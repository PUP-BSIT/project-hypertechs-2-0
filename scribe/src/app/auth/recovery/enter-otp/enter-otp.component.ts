import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss', '../recovery.component.scss']
})
export class EnterOtpComponent {
  otp: string = '';
  @Output() otpSubmitted = new EventEmitter<string>();

    ngOnInit() {
      this.openModal();
    }
  
    submitOtp() {
      this.otpSubmitted.emit(this.otp);
    }
  
    openModal() {
      const modal = document.getElementById('otp_modal');
      if (modal) {
        modal.style.display = 'block';
      }
    }
  
    closeModal() {
      const modal = document.getElementById('otp_modal');
      if (modal) {
        modal.style.display = 'none';
      }
    }
  }