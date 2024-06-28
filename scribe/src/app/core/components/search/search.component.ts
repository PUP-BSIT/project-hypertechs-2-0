import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { simpleFade, slideInOut } from '../../../../animations/element-animations';
import { SearchService } from '../../../../services/search/search.service';
import { EventEmitter, Output, Input } from '@angular/core';
import { NoteService } from '../../../../services/notes/note.service';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  animations: [simpleFade, slideInOut]
})
export class SearchComponent implements OnInit{

  searchTerm : any = '';
  notes: any[] =[];
  isLoading = true;
  errorMessage: any;
  clearSearch : boolean = false;
  private userSubscription!: Subscription;

  ngOnInit(): void {
    
  }

}
