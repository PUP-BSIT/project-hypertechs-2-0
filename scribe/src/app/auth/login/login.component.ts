import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        this.userService.setFirstname(userData.firstname);
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

  onSubmit() {
   /* Return if user inputs are invalid */
    if (!this.loginForm.valid) return;

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
          this.router.navigate(['main']);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
  }

  /* Returns the error messages */
  handleError(error: HttpErrorResponse | Error) {
    this.errorMessage = 'Login failed';
  
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.errorMessage = 
        `Server is unreachable. Please make sure your server is running.`;
      } else {
        if (error.error) {
          this.errorMessage = error.error.error;
        }
  
        if (error?.status) {
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
      }
    } else {
      // Handle non-HTTP errors, such as network errors
      this.errorMessage =
      `Network error occurred. Please check your internet connection.`;
    }
  
    /* Snackbar for error messages */
    this.snackBar.open(this.errorMessage, 'Close', {
      duration: 7000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar']
    });
  }
}
