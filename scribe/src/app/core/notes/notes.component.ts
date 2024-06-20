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
  private userSubscription!: Subscription;

  constructor(private noteService: NoteService, private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(userId => {
      if (userId !== null) {
        this.loadNotes();
      } else {
        this.notes = []; // Clear notes when no user is logged in
      }
    });
  }

  loadNotes() {
    this.noteService.getNotes().subscribe(
      (data) => {
        console.log('Notes received from backend:', data);
        this.notes = data;
      },
      (error) => {
        console.error('Error fetching notes:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
