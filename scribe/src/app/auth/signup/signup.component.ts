import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SignupData } from '../../../models/model';
import { UserService } from '../../../services/user/user.service';
import { SignupService } from '../../../services/signup/signup.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = this.formBuilder.group({});
  errorMessage: string = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      {
        lastname: ['', Validators.required],
        firstname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirm_password: ['', [Validators.required]],
      },
      { validators: this.matchValidator('password', 'confirm_password') }
    );

    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.userService.setFirstname(userData.firstname);
        this.userService.setLastname(userData.lastname);
        this.userService.setEmail(userData.email);
        this.router.navigate(['main']);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        /* Clear invalid data and proceed normally */
        sessionStorage.removeItem('loggedInUser');
      }
    }
  }

  get lastnameControl() {
    return this.signupForm.get('lastname');
  }

  get firstnameControl() {
    return this.signupForm.get('firstname');
  }

  get emailControl() {
    return this.signupForm.get('email');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }

  get confirmPasswordControl() {
    return this.signupForm.get('confirm_password');
  }

  matchValidator(password: string, confirmPassword: string): Validators {
    return (abstractControl: AbstractControl) => {
      const ctrlPassword = abstractControl.get(password);
      const ctrlConfirmPassword = abstractControl.get(confirmPassword);

      if (
        ctrlConfirmPassword!.errors &&
        !ctrlConfirmPassword!.errors?.['confirmedValidator']
      ) {
        return null;
      }

      if (ctrlPassword!.value !== ctrlConfirmPassword!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        ctrlConfirmPassword!.setErrors(error);
        return error;
      } else {
        ctrlConfirmPassword!.setErrors(null);
        return null;
      }
    };
  }

  onSubmit() {
    /* Return if potential user inputs are invalid */
    if (!this.signupForm.valid) return;
    this.isLoading = true;

    const signupData: SignupData = {
      lastname: this.lastnameControl?.value,
      firstname: this.firstnameControl?.value,
      email: this.emailControl?.value,
      password: this.passwordControl?.value,
    };

    console.log('Data sent to service: ', signupData);

    this.signupService.signupUser(signupData).subscribe({
      next: (response) => {
        console.log('Response from server:', response);
        sessionStorage.setItem('loggedInUser', JSON.stringify(response));
        this.userService.setFirstname(signupData.firstname);
        this.userService.setLastname(signupData.lastname);
        this.userService.setEmail(signupData.email);
        this.router.navigate(['main']);
        this.isLoading = false;
        this.snackbarService.dismiss();
      },
      error: (error: HttpErrorResponse) => {
        this.handleError(error);
        this.isLoading = false;
      },
    });
  }

  /* Handle the error messages */
  handleError(error: HttpErrorResponse | Error) {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleNetworkError();
    }

    this.snackbarService.show(this.errorMessage);
  }

  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.errorMessage = 
        `Server is unreachable. Please make sure your server is running.`;
      return;
    }

    if (error.error && error.error.error) {
      this.errorMessage = error.error.error;
      return;
    }

    switch (error.status) {
      case 400:
        this.errorMessage = `This email has already been used. Use a new one.`;
        break;

      case 500:
        this.errorMessage = `Internal server error. Please try again later.`;
        break;

      default:
        this.errorMessage = `Error: ${error.status}. Please try again later.`;
    }
  }

  private handleNetworkError() {
    this.errorMessage 
      = `Network error occurred. Please check your internet connection.`;
  }
}
