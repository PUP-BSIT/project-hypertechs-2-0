import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginData } from '../../../models/model';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  //loginForm: FormGroup;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, 
    private router: Router, private userService: UserService
  ){}

  loginForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })

    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser); // Parse stored JSON data
        this.userService.setFirstname(userData.firstname);
        this.router.navigate(['main']); 
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data and proceed normally
        sessionStorage.removeItem('loggedInUser');
      }
    }
  }

  get emailControl(){
    return this.loginForm.get('email');
  }

  get passwordControl(){
    return this.loginForm.get('password');
  }

  onSubmit(){
    //return if user inputs are invalidd
    if (!this.loginForm.valid) return; 
    
    //if valid, service will get the data
    const loginData: LoginData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

    console.log("Data sent to service: ", loginData);
    
    //service will process the data 
    this.loginService.loginUser(loginData)
    .subscribe({
      next: (response)=>{
        console.log("Response from server: ", response);
        //I disabled routing after successful log in
        // for the meantime I used alert 
        sessionStorage.setItem('loggedInUser', JSON.stringify(response));
        this.router.navigate(['main'], { queryParams: { firstname: response.firstname} });
        //alert(`Log In Successful! Hi ${response.username}`);
      },
      error:(error: HttpErrorResponse)=>{
        this.handleError(error) },
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
