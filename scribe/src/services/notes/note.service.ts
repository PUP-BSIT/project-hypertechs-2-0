import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost/backend/notes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getNotes(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.apiUrl}/get-notes.php?user_id=${userId}`);
  }

  saveNote(noteData: any): Observable<any> {
    const userId = this.authService.getUserId();
    noteData.user_id = userId;
    return this.http.post(`${this.apiUrl}/save-notes.php`, noteData);
  }

  updateNote(noteId: number, noteData: any): Observable<any> {
    const userId = this.authService.getUserId();
    noteData.user_id = userId;
    return this.http.post(
      `${this.apiUrl}/update-notes.php?id=${noteId}`,
      noteData
    );
  }

  getNoteById(noteId: number): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(
      `${this.apiUrl}/get-notes-id.php?id=${noteId}&user_id=${userId}`
    );
  }
}