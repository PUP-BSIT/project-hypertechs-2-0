import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpverificationService {
  private apiUrl = 'https://beta.scribenote.tech/backend/otp/otp.php';

  constructor(private http: HttpClient) { }

  verifyOtp(otp: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(this.apiUrl, { otp }, options); 
  }
}
