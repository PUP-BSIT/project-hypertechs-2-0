import { Component, Input } from '@angular/core';

interface Note {
  id: number;
  title: string;
  content: string;
  lastEdited: Date;
}

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
})
export class NoteCardComponent {
  @Input() note!: Note;
}
