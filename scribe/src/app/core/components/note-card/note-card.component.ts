import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxMasonryOptions } from 'ngx-masonry';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  @Input() note: any;

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log('Note data:', this.note);

    // Convert last_edited to Date object if it is a string
    if (this.note.last_edited && typeof this.note.last_edited === 'string') {
      this.note.last_edited = new Date(this.note.last_edited);
    }
  }

  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.note.content);
  }

  public masonryOptions: NgxMasonryOptions = {
    itemSelector: '.note',
    columnWidth: '.note',
    gutter: 20,
    percentPosition: true,
    resize: true,
    fitWidth: true,
  };

  editNote() {
    this.router.navigate(['/main/editor', this.note.id]);
  }
}
