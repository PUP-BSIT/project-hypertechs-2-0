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

  constructor(
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((userId) => {
      console.log('User ID:', userId);
      if (userId !== null) {
        this.loadNotes();
      } else {
        this.notes = [];
        this.isLoading = false;
      }
    });
  }

  loadNotes() {
    console.log('Loading notes...');
    this.noteService.getNotes().subscribe(
      (data: any[]) => {
        console.log('Notes received from backend:', data);
        this.notes = data.filter((note) => note.is_deleted == 0);
        console.log('Filtered notes:', this.notes);
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
}
