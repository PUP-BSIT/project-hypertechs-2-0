import { Component, Input } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';

interface Note {
  title: string;
  content: string;
  lastEdited: string;
}

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
})
export class NoteCardComponent {
  @Input() note!: Note;

  notes = [
    {
      title: 'Note 1',
      content: 'This is a short note.',
      lastEdited: '2 minutes ago'
    },
    {
      title: 'Note 2',
      content: 'Here is an even longer note that spans multiple lines to test the layout with more content. Is it working now?',
      lastEdited: '4 hours ago'
    },
    {
      title: 'Note 3',
      content: 'Another short note for variety.',
      lastEdited: 'Yesterday'
    },
    {
      title: 'Note 4',
      content: 'Content of Note 1',
      lastEdited: '3 days ago'
    },
    {
      title: 'Note 5',
      content: 'Am I allowed to cry?',
      lastEdited: '6 days ago'
    },
    {
      title: 'Note 6',
      content: 'Content of Note 3',
      lastEdited: 'Last Week'
    }
  ];

  public masonryOptions: NgxMasonryOptions = {
    itemSelector: '.note',
    columnWidth: '.note',
		gutter: 20,
    percentPosition: true,
		resize: true,
		fitWidth: true,
	};
}

