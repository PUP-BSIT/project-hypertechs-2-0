import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpverificationService {
  private apiUrl = 'https://preview.scribenote.tech/backend/otp';
  private passUrl = 'https://preview.scribenote.tech/backend/auth';

  constructor(private http: HttpClient) { }

  verifyOtp(otp: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(`${this.apiUrl}/otp.php`, { otp }, options);
  }

  sendOtp(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(`${this.apiUrl}/enter-email.php`, { email }, options);
  }

  resetPassword(user_id: string, password: string): Observable<any> {
    return this.http.post(`${this.passUrl}/reset-pass.php`, { user_id, password: password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  resendOtp(user_id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(`${this.apiUrl}/resend.php`, {user_id}, options);
  }
}
