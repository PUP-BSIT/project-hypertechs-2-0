import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupData } from '../models/model';

@Injectable()
export class SignupService {
  private baseUrl = 'http://localhost/backend/signup.php';

  constructor() { }
}
