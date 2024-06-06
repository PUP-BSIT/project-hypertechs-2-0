import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignupData } from '../../../models/model';
import { SignupService } from '../../../services/signup.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = this.formBuilder.group({});
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private signupService: SignupService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
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

  onSubmit() {
    // Return if potential user inputs are invalid
    if (!this.signupForm.valid) return;

    const signupData: SignupData = {
      lastname: this.lastnameControl?.value,
      firstname: this.firstnameControl?.value,
      email: this.emailControl?.value,
      password: this.passwordControl?.value,
    };

    console.log("Data sent to service: ", signupData);

    this.signupService.signupUser(signupData)
        .subscribe({
          next: (response) => {
            console.log("Response from server:", response);
            this.router.navigate(['main/home'], { queryParams: { firstname: signupData.firstname } });
            //alert(`Log In Successful! Hi ${response.firstname}`);
          },
          
        });
  }

  handleError(error: HttpErrorResponse){
    this.errorMessage = 'Login failed';
  
    if (error.error) {
      this.errorMessage = error.error.error; 
    }

    if (error?.status){
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
          this.errorMessage = 
          `Error: ${error.status}. Please try again later.`;
      } 
    } 
  }      

}
