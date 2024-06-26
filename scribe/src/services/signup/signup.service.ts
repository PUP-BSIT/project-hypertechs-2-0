import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupData } from '../../models/model';

@Injectable()
export class SignupService {
  private baseUrl = 'http://localhost/backend/auth/signup.php';

  constructor( private http: HttpClient) { }
  
  signupUser(signupData: SignupData): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.post(this.baseUrl, signupData, httpOptions);
  } 
}
