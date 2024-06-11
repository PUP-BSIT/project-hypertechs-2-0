import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginData } from '../../../models/model';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  loginForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, 
        this.customEmailValidator()]],
      password: ['', Validators.required]
    });

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

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const email = control.value as string; // Cast to string for type safety

      // Regular expression for email format
      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}))$/;
      
        //stricter validation using emailRegex
        if (emailRegex && !emailRegex.test(email)) {
          return { invalidEmail: true }; // Invalid if format doesn't match
        } else {
          return null; // Valid email
        }
    };
  }

  onSubmit() {
   /* Return if user inputs are invalid */
    if (!this.loginForm.valid) return;
    this.isLoading = true;

    /* If valid, service will get the data */
    const loginData: LoginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log("Data sent to service: ", loginData);

    /* Service will process the data */
    this.loginService.loginUser(loginData)
      .subscribe({
        next: (response) => {
          console.log("Response from server: ", response);
          sessionStorage.setItem('loggedInUser', JSON.stringify(response));
          this.userService.setFirstname(response.firstname);
          this.userService.setLastname(response.lastname);
          this.userService.setEmail(response.email);
          this.router.navigate(['main']);
          this.isLoading = false;
          this.dismissSnackbar();
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
          this.isLoading = false;
        }
      });
  }

  /* Handle the error messages */
  handleError(error: HttpErrorResponse | Error) {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleNetworkError();
    }
  
    this.showSnackbar();
  }
  
  private handleHttpError(error: HttpErrorResponse) {
    if (error.status === 0) {
      this.errorMessage = 
      `Server is unreachable. Please make sure the server is running.`;
      return;
    }
  
    if (error.error && error.error.error) {
      this.errorMessage = error.error.error;
      return;
    }
  
    switch (error.status) {
      case 400:
        this.errorMessage =
        `Bad request. Please check your data.`;
        break;

      case 401:
        this.errorMessage =
        `You have entered an invalid email or password.`;
        break;

      case 500:
        this.errorMessage =
        `Internal server error. Please try again later.`;
        break;
        
      default:
        this.errorMessage =
        `Error: ${error.status}. Please try again later.`;
    }
  }
  
  private handleNetworkError() {
    this.errorMessage = 
    `Network error occurred. Please check your internet connection.`;
  }
  
  private showSnackbar() {
    this.snackBar.open(this.errorMessage, 'Close', {
      duration: 7000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  private dismissSnackbar() {
    this.snackBar.dismiss();
  }
}