import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost/backend/notes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* Fetch and display all the notes */
  getNotes(sortBy: string = 'lastEdited'): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(
      `${this.apiUrl}/get-notes.php?user_id=${userId}&sort_by=${sortBy}`
    );
  }

  /* Fetch a note by ID for proper edit/update */
  getNoteById(noteId: number): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(
      `${this.apiUrl}/get-notes-id.php?id=${noteId}&user_id=${userId}`
    );
  }

  /* Save the newly created notes */
  saveNote(noteData: any): Observable<any> {
    const userId = this.authService.getUserId();
    noteData.user_id = userId;
    return this.http.post(`${this.apiUrl}/save-notes.php`, noteData);
  }

  /* Edit existing notes */
  updateNote(noteId: number, noteData: any): Observable<any> {
    const userId = this.authService.getUserId();
    noteData.user_id = userId;
    return this.http.post(
      `${this.apiUrl}/update-notes.php?id=${noteId}`,
      noteData
    );
  }

  /* Fetch the soft-deleted notes */
  getDeletedNotes(sortBy: string = 'lastEdited'): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(
      `${this.apiUrl}/get-deleted-notes.php?user_id=${userId}&sort_by=${sortBy}`
    );
  }

  /* Soft-delete a note */
  deleteNote(noteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/soft-delete-notes.php`, {
      id: noteId,
    });
  }

  /* Restore soft-deleted notes */
  restoreNote(noteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/restore-notes.php`, { id: noteId });
  }

  /* Permanently or hard-delete a note */
  hardDeleteNote(noteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/hard-delete-notes.php`, {
      id: noteId,
    });
  }

  /* Permanently delete ALL soft-deleted notes */
  emptyTrash(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.post(`${this.apiUrl}/empty-trash.php`, {
      user_id: userId,
    });
  }

  togglePinNote(noteId: number, isPinned: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle-pin-note.php`, {
      id: noteId,
      is_pinned: isPinned,
    });
  }

  toggleLockNote(noteId: number, isLocked: boolean): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.post(`${this.apiUrl}/toggle-lock-notes.php`, {
      id: noteId,
      is_locked: isLocked,
      userId: userId,
    });
  }

  checkUserPassword(password: string): Observable<boolean> {
    const userId = this.authService.getUserId();
    return this.http
      .post<{ success: boolean; isCorrect: boolean }>(
        `${this.apiUrl}/check-user-password.php`,
        { password: password, userId: userId }
      )
      .pipe(
        map((response) => response.isCorrect)
      );
  }
}
