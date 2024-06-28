import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://localhost/backend/search/search.php';
  private notesSubject = new BehaviorSubject<any[]>([]);
  notes$ = this.notesSubject.asObservable();

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  constructor(private http: HttpClient) { }

  searchNotes(user_id: string, searchTerm: string): Observable<any> {
    const params = new HttpParams()
      .set('user_id', user_id)
      .set('searchTerm', searchTerm);

    return this.http.get<any>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          throw 'Error in API call:' + error.message;
        })
      );
  }

  updateSearchResults(results: any[]) {
    this.notesSubject.next(results);
  }

  updateSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }
  
}
