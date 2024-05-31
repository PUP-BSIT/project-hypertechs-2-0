import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginData } from '../../../models/model';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  //loginForm!: FormGroup;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private loginService: LoginService
  ){}

  loginForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }

  get emailControl(){
    return this.loginForm.get('email');
  }

  get passwordControl(){
    return this.loginForm.get('password');
  }

  onSubmit(){
    
  } 
  

}
