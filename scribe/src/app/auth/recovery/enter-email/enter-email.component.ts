import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { LoginData } from '../../../../models/model';
import { LoginService } from '../../../../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter-email',
  templateUrl: './enter-email.component.html',
  styleUrls: ['../recovery.component.scss'],
})
export class EnterEmailComponent implements OnInit {
  @Output() emailSubmitted = new EventEmitter<string>(); // Add EventEmitter
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  recoveryForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.recoveryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser); // Parse stored JSON data
        alert(`Log In Successful! Hi ${userData.username}`);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        sessionStorage.removeItem('loggedInUser');
      }
    }
  }

  get emailControl() {
    return this.recoveryForm.get('email');
  }

  get passwordControl() {
    return this.recoveryForm.get('password');
  }

  onSubmit() {
    if (!this.recoveryForm.valid) return;

    const loginData: LoginData = {
      email: this.recoveryForm.value.email,
      password: this.recoveryForm.value.password,
    };

    console.log('Data sent to service: ', loginData);

    this.loginService.loginUser(loginData).subscribe({
      next: (response) => {
        console.log('Response from server: ', response);
        sessionStorage.setItem('loggedInUser', JSON.stringify(response));
        alert(`Log In Successful! Hi ${response.username}`);
        this.emailSubmitted.emit(loginData.email); // Emit the email on success
      },
      error: (error: any) => {
        console.error('Error Object', error);
        this.errorMessage = 'Login failed.';

        if (error.error) {
          this.errorMessage = error.error.error;
        }

        if (error.status) {
          switch (error.status) {
            case 400:
              this.errorMessage = 'Bad request. Please check your data.';
              break;
            case 401:
              this.errorMessage =
                'You have entered an invalid email or password.';
              break;
            case 500:
              this.errorMessage =
                'Internal server error. Please try again later.';
              break;
            default:
              this.errorMessage = `Error: ${error.status}. Please try again later.`;
          }
        }
      },
    });
  }
}
