import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupData } from '../../models/model';

@Injectable()
export class SignupService {
  private signUpUrl = 'https://scribenote.tech/backend/auth';

  constructor( private http: HttpClient) { }
  
  signupUser(signupData: SignupData): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(`${this.signUpUrl}/signup.php`, signupData, httpOptions);
  } 
}
