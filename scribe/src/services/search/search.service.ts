import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://localhost/backend/search.php';
  private notesSubject = new BehaviorSubject<any[]>([]);
  notes$ = this.notesSubject.asObservable();

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  
}
