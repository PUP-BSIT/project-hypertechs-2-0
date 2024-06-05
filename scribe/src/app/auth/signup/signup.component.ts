import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  constructor(private formBuilder: FormBuilder){}

  signupForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    
    this.signupForm = this.formBuilder.group({
      lastname:['', Validators.required],
      firstname:['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required],
      confirm_password:['', Validators.required]
    })
  }

  get lastnameControl(){
    return;
  }

  get firstnameControl(){
    return;
  }

  get emailControl(){
    return;
  }

  get passwordControl(){
    return;
  }

  get confirmPasswordControl(){
    return;
  }

  onSubmit(){
    //return if potential user inputs are invalidd
    if (!this.signupForm.valid) return; 
  }
}
