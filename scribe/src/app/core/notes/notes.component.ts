import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { simpleFade, slideInOut } from '../../../animations/element-animations';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: [simpleFade, slideInOut],
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  paginatedNotes: any[] = [];
  isLoading = true;
  currentSortOption = 'lastEdited';
  pageSize = 25;
  currentPage = 0;
  showFirstLastButtons = true;
  private userSubscription!: Subscription;
  pinnedNotes: any[] = [];

  constructor(
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((userId) => {
      if (userId !== null) {
        this.loadNotes();
      } else {
        this.notes = [];
        this.paginatedNotes = [];
        this.isLoading = false;
      }
    });
  }
  
  loadNotes() {
    this.isLoading = true;
    this.noteService.getNotes(this.currentSortOption).subscribe(
      (data: any[]) => {
        this.notes = data.filter((note) => note.is_deleted == 0);
        this.pinnedNotes = this.notes.filter((note) => note.is_pinned == 1);
        this.paginateNotes();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false;
      }
    );
  }
  
  paginateNotes() {
    const nonPinnedNotes = this.notes.filter((note) => note.is_pinned == 0);
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedNotes = nonPinnedNotes.slice(start, end);
  }

  onNoteDelete(noteId: number) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
    this.pinnedNotes = this.pinnedNotes.filter((note) => note.id !== noteId);
    this.paginateNotes();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateNotes();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  trackByNoteId(index: number, note: any): number {
    return note.id;
  }

  sortNotes(option: string) {
    this.currentSortOption = option;
    this.loadNotes();
  }

  get currentSortOptionLabel() {
    switch (this.currentSortOption) {
      case 'dateCreated':
        return 'Date Created';
      case 'titleAsc':
        return 'Title (A to Z)';
      case 'titleDesc':
        return 'Title (Z to A)';
      case 'lastEdited':
      default:
        return 'Last Edited';
    }
  }

  onPinStatusChange(note: any) {
    // Update the note in the main notes array
    const noteIndex = this.notes.findIndex((n) => n.id === note.id);
    if (noteIndex !== -1) {
      this.notes[noteIndex].is_pinned = note.is_pinned;
    }

    // Update the pinned and paginated notes
    if (note.is_pinned) {
      this.pinnedNotes.push(note);
    } else {
      this.pinnedNotes = this.pinnedNotes.filter((n) => n.id !== note.id);
    }

    this.paginateNotes();
  }
}
