import { Component, OnInit } from '@angular/core';
import { NoteService } from '../../../services/notes/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent implements OnInit {
  notes: any[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadNotes();
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
}
