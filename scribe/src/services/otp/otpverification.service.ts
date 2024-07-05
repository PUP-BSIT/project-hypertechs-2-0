import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpverificationService {
  private apiUrl = 'https://preview.scribenote.tech/backend/otp/otp.php';
  private emailUrl = 'https://preview.scribenote.tech/backend/otp/enter-email.php';
  private passUrl = 'https://preview.scribenote.tech/backend/auth/reset-pass.php';
  private resendUrl ='https://preview.scribenote.tech/backend/otp/resend.php';

  constructor(private http: HttpClient) { }

  verifyOtp(otp: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(this.apiUrl, { otp }, options); 
  }

  sendOtp(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(this.emailUrl, { email }, options);
  }

  resetPassword(user_id: string, password: string): Observable<any> {
    return this.http.post(this.passUrl, { user_id, password: password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  resendOtp(user_id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers }; 
    return this.http.post<any>(this.resendUrl, {user_id}, options);
  }
}
