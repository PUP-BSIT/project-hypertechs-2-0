import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  isLoading = true; // Add this flag
  private userSubscription!: Subscription;

  constructor(private noteService: NoteService, private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(userId => {
      if (userId !== null) {
        this.loadNotes();
      } else {
        this.notes = []; // Clear notes when no user is logged in
        this.isLoading = false; // Set loading to false if no user
      }
    });
  }

  loadNotes() {
    this.noteService.getNotes().subscribe(
      (data) => {
        console.log('Notes received from backend:', data);
        this.notes = data;
        this.isLoading = false; // Set the flag to false when loading is complete
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false; // Set the flag to false even on error
      }
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  trackByNoteId(index: number, note: any): number {
    return note.id; // or whatever unique identifier your notes have
  }
}
