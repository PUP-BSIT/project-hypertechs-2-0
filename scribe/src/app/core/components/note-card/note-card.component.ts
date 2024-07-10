import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NoteService } from '../../../../services/notes/note.service';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { LockDialogComponent } from '../lock-dialog/lock-dialog.component';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  @Input() note: any;
  @Input() isInTrash: boolean = false;
  @Input() themeColor: string = 'default';
  @Output() restore = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() deleteForever = new EventEmitter<number>();
  @Output() pinStatusChange = new EventEmitter<any>();

  themeColors: { [key: string]: { dark: string; light: string } } = {
    default: { dark: '#1a1d1d', light: '#eff0ef' },
    red: { dark: '#77172e', light: '#edd6db' },
    orange: { dark: '#55200f', light: '#efdfda' },
    green: { dark: '#173125', light: '#d0eade' },
    sea: { dark: '#0c3836', light: '#d1eae8' },
    blue: { dark: '#172733', light: '#d8e5ef' },
    purple: { dark: '#2e2238', light: '#e8def0' },
    rose: { dark: '#422230', light: '#f5dce7' },
    brown: { dark: '#39342d', light: '#efe8dd' },
  };

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private noteService: NoteService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('Note data:', this.note);
    console.log('Is locked:', this.note.is_locked, typeof this.note.is_locked);

    if (this.note.last_edited && typeof this.note.last_edited === 'string') {
      this.note.last_edited = new Date(this.note.last_edited);
    }
  }

  get sanitizedContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.note.content);
  }

  get noteBackgroundColor(): string {
    const isDarkMode = document.body.classList.contains('dark-mode');
    return this.themeColors[this.themeColor][isDarkMode ? 'dark' : 'light'];
  }

  editNote() {
    const queryParams = this.isInTrash ? { readonly: true } : {};
    this.router.navigate(['/main/editor', this.note.id], { queryParams });
  }

  deleteNote() {
    if (this.note.is_locked) {
      const dialogRef = this.dialog.open(LockDialogComponent, {
        data: { title: 'Enter Password', noteId: this.note.id },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.password) {
          this.performDeleteNote();
        }
      });
    } else {
      this.performDeleteNote();
    }
  }
  
  private performDeleteNote() {
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
        this.snackbarService.show('Error moving note to trash');
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

  togglePinNote() {
    this.noteService
      .togglePinNote(this.note.id, !this.note.is_pinned)
      .subscribe(
        () => {
          this.note.is_pinned = !this.note.is_pinned;
          this.snackbarService.show(
            `Note ${this.note.is_pinned ? 'pinned' : 'unpinned'} successfully`
          );
          this.pinStatusChange.emit(this.note);
        },
        (error) => {
          console.error('Error toggling pin status:', error);
        }
      );
  }

  toggleLockNote() {
    if (this.note.is_locked) {
      this.unlockNote();
    } else {
      this.lockNote();
    }
  }

  lockNote() {
    const dialogRef = this.dialog.open(LockDialogComponent, {
      data: { title: 'Lock Note' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.password) {
        this.noteService
          .toggleLockNote(this.note.id, true, result.password)
          .subscribe(
            () => {
              this.note.is_locked = true;
              this.snackbarService.show('Note locked successfully');
            },
            (error) => {
              console.error('Error locking note:', error);
              this.snackbarService.show('Error locking note');
            }
          );
      }
    });
  }

  unlockNote() {
    const dialogRef = this.dialog.open(LockDialogComponent, {
      data: { title: 'Unlock Note', noteId: this.note.id },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.password) {
        this.noteService.toggleLockNote(this.note.id, false).subscribe(
          () => {
            this.note.is_locked = false;
            this.snackbarService.show('Note unlocked successfully');
          },
          (error) => {
            console.error('Error unlocking note:', error);
            this.snackbarService.show('Error unlocking note');
          }
        );
      }
    });
  }

  openNote() {
    if (this.note.is_locked) {
      const dialogRef = this.dialog.open(LockDialogComponent, {
        data: { title: 'Enter Password', noteId: this.note.id },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.password) {
          this.editNote();
        }
      });
    } else {
      this.editNote();
    }
  }
}
