import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NoteService } from '../../../../services/notes/note.service';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  @Input() note: any;
  @Input() isInTrash: boolean = false;
  @Output() restore = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() deleteForever = new EventEmitter<number>();

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private noteService: NoteService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    console.log('Note data:', this.note);

    if (this.note.last_edited && typeof this.note.last_edited === 'string') {
      this.note.last_edited = new Date(this.note.last_edited);
    }
  }

  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.note.content);
  }

  editNote() {
    const queryParams = this.isInTrash ? { readonly: true } : {};
    this.router.navigate(['/main/editor', this.note.id], { queryParams });
  }

  deleteNote() {
    this.noteService.deleteNote(this.note.id).subscribe(
      () => {
        console.log('Note deleted successfully');
        this.delete.emit(this.note.id);
        this.snackbarService.show(
          'Note moved to trash', 
          'Go to Trash', 
          3000, 
          () => this.router.navigate(['/main/trash'])
        );
      },
      (error) => {
        console.error('Error deleting note:', error);
      }
    );
  }

  onDelete() {
    this.delete.emit(this.note.id);
  }

  restoreNote() {
    this.restore.emit(this.note.id);
    this.snackbarService.show(
      'Note successfully restored!', 
      'Go to Notes', 
      3000,
      () => this.router.navigate(['/main/notes'])
    );
  }

  hardDeleteNote() {
    const dialogRef = this.dialogService.openDialog({
      title: 'Delete Permanently',
      content: 'Are you sure you want to delete this note forever?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      action: 'confirm',
      actionTextColor: '#fff',
      actionBgColor: '#cf252e',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.noteService.hardDeleteNote(this.note.id).subscribe(
          () => {
            console.log('Note permanently deleted successfully');
            this.snackbarService.show('Note permanently deleted');
            this.deleteForever.emit(this.note.id);
          },
          (error) => {
            console.error('Error permanently deleting note:', error);
            this.snackbarService.show(
              'Error permanently deleting note',
              'Retry'
            );
          }
        );
      }
    });
  }
}
