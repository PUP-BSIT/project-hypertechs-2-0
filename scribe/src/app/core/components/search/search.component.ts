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

  constructor(
    private searchService: SearchService,  
    private noteService: NoteService, 
    private cd: ChangeDetectorRef, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.searchService.searchTerm$.subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      /**TODO FOR TESTING */
      console.log("LISTEN TERM: ", this.searchTerm);
      if (!searchTerm) {
        this.clearSearch = true;
        /**TODO FOR TESTING */
        console.log("EMPTY TERM", this.searchTerm);
      } else{
        this.clearSearch = false;
      }
    });

    this.userSubscription = this.authService.user$.subscribe((userId) => {
      if (userId !== null) {
        this.loadResults();
        /**TODO testing */
        console.log("search ID", userId);
      } else {
        this.notes = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();

  }

  loadResults() {
    this.searchService.notes$.subscribe(
      (data: any[]) => {
        this.notes = data;
        this.isLoading = false;
      },
    );
  }
}
