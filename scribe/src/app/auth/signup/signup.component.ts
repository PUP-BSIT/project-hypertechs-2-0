import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignupData } from '../../../models/model';
import { SignupService } from '../../../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder, private signupService: SignupService) {}

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
  }
}
