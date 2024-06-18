import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl = 'http://localhost/backend/notes';

  constructor(private http: HttpClient) { }

  getNotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-notes.php`);
  }

  saveNote(noteData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save-notes.php`, noteData);
  }

  updateNote(noteId: number, noteData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-notes.php?id=${noteId}`, noteData);
  }
  
  getNoteById(noteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-notes-id.php?id=${noteId}`);
  }
}
