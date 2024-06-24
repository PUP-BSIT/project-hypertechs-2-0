import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { OtpverificationService } from '../../../../services/otp/otpverification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-enter-new-password',
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['../recovery.component.scss']
})
export class EnterNewPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  user_id : string = '';
  resetForm : FormGroup = this.fb.group({});
  @Output() passwordSubmitted = new EventEmitter<string>();

  passwordError: boolean = false;
  confirmPasswordError: boolean = false;

  constructor(
    private otpService: OtpverificationService, 
    private router: Router, 
    private route: ActivatedRoute,
    private snackbarService: SnackbarService, 
    private authService: AuthService, 
    private userService: UserService,
    private fb : FormBuilder,
  ){}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      console.log('User ID:', this.user_id);
    });
  }

  onSubmit() {
    this.passwordError = false;
    this.confirmPasswordError = false;

    if (this.password.length < 8) {
      this.passwordError = true;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = true;
      return;
    }

    //TODO
    //console.log('Password reset successfully');
    //this.passwordSubmitted.emit(this.password);
    
    console.log(this.password);
    console.log(this.user_id);
      
    this.otpService.resetPassword(this.user_id, this.password)
        .subscribe(response => {
          if (response.status === 'success') {
            localStorage.setItem('loggedInUser', JSON.stringify(response));
            this.userService.setFirstname(response.firstname);
            this.userService.setLastname(response.lastname);
            this.userService.setEmail(response.email);
            this.router.navigate(['main']);
          } else {
            this.snackbarService.show(response.message, 'Try again');
          }
      });
    }
}