import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { simpleFade, searchFade } from '../../../../animations/element-animations';
import { SearchService } from '../../../../services/search/search.service';
import { NoteService } from '../../../../services/notes/note.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  animations: [simpleFade, searchFade]
})
export class SearchComponent implements OnInit{

  searchTerm : any = '';
  notes: any[] =[];
  isLoading = true;
  errorMessage: any;
  clearSearch : boolean = false;
  private userSubscription!: Subscription;
  userTasks: any[] = [];
  isTaskpresent: boolean = false;
  showOnlyNotes = false; 
  

  constructor(
    private searchService: SearchService,  
    private noteService: NoteService, 
    private cd: ChangeDetectorRef, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      if (!searchTerm) {
        this.clearSearch = true;
      } else {
        this.clearSearch = false;
      }
    });
  
    this.userSubscription = this.authService.user$.subscribe((userId) => {
      if (userId !== null) {
        this.loadResults();
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
        this.notes = data.filter(item => item.hasOwnProperty('id'));
        this.userTasks = data.filter(item => item.hasOwnProperty('task_id'));
        this.isLoading = false;
      }
    );
  
    // Reset search results if search term is empty
    if (!this.searchTerm.trim()) {
      this.notes = [];
      this.userTasks = [];
      this.clearSearch = true;
    }
  }
  

  onNoteDelete(noteId: number) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  onTaskDeleted(taskId: number) {
    this.userTasks = this.userTasks.filter((task) => task.task_id !== taskId);
  }

  trackByNoteId(index: number, note: any): number {
    return note.id;
  }
}
