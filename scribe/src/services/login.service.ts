import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginData } from '../models/model';

@Injectable()
export class LoginService {

  private baseUrl = 'http://localhost/backend/login.php';
  constructor( private http: HttpClient) { }

  
}
