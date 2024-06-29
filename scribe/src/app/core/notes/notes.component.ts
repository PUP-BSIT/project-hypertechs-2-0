import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { simpleFade, slideInOut } from '../../../animations/element-animations';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: [simpleFade, slideInOut],
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  isLoading = true;
  private userSubscription!: Subscription;
  currentSortOption = 'lastEdited';

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
        this.isLoading = false;
      }
    });
  }

  loadNotes() {
    this.isLoading = true;
    this.noteService.getNotes(this.currentSortOption).subscribe(
      (data: any[]) => {
        this.notes = data.filter((note) => note.is_deleted == 0);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false;
      }
    );
  }

  onNoteDelete(noteId: number) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
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
}
