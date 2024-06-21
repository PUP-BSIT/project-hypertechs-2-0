import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { OtpverificationService } from '../../../../services/otp/otpverification.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { UserService } from '../../../../services/user/user.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-enter-email',
  templateUrl: './enter-email.component.html',
  styleUrls: ['../recovery.component.scss'],
})
export class EnterEmailComponent implements OnInit {
  @Output() emailSubmitted = new EventEmitter<string>(); // Add EventEmitter
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private otpService: OtpverificationService,
    private router: Router,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  recoveryForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get emailControl() {
    return this.recoveryForm.get('email');
  }

  onSubmit() {
    if (!this.recoveryForm.valid) return;
    this.isLoading = true;

    const emailData = this.recoveryForm.value.email;

    // TODO for testing
    console.log('Data sent to service: ', emailData);

    this.otpService.sendOtp(emailData).subscribe({
      next: (response) => {
        console.log('Response from server: ', response);
        localStorage.setItem('loggedInUser', JSON.stringify(response));
        this.userService.setUserId(response.user_id);
        this.authService.setUserId(response.user_id); 
        //console.log(response.user_id);
        this.openSentmailDialog();
        this.isLoading = false;
        this.snackbarService.dismiss();
      },
    });
  }

  openSentmailDialog(): void {
    const dialogRef = this.dialogService.openDialog({
      title: 'Email Verification',
      content: 'We sent an OTP code to your email to verify your identity.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
      action: 'ok',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.router.navigate(['enter-otp']);
      }
    });
  }
}
