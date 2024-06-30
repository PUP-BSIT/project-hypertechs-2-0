import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { DialogService } from '../../../services/dialog/dialog.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { simpleFade, slideInOut } from '../../../animations/element-animations';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
  animations: [simpleFade, slideInOut],
})
export class TrashComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  isLoading = true;
  private userSubscription!: Subscription;

  constructor(
    private noteService: NoteService,
    private authService: AuthService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((userId) => {
      if (userId !== null) {
        this.loadDeletedNotes();
      } else {
        this.notes = [];
        this.isLoading = false;
      }
    });
  }

  loadDeletedNotes() {
    this.noteService.getDeletedNotes().subscribe(
      (data: any[]) => {
        console.log('Deleted notes received from backend:', data);
        this.notes = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching deleted notes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  restoreNote(noteId: number) {
    this.noteService.restoreNote(noteId).subscribe(
      () => {
        console.log('Note restored successfully');
        this.loadDeletedNotes(); // Reload the deleted notes list
      },
      (error) => {
        console.error('Error restoring note:', error);
      }
    );
  }

  refreshTrash(noteId: number) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  hardDeleteNote(noteId: number) {
    this.noteService.hardDeleteNote(noteId).subscribe(
      () => {
        console.log('Note permanently deleted successfully');
        this.notes = this.notes.filter((note) => note.id !== noteId);
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => {
        console.error('Error permanently deleting note:', error);
      }
    );
  }

  confirmEmptyTrash() {
    const dialogRef = this.dialogService.openDialog({
      title: 'Empty Trash',
      content: `Are you sure you want to permanently delete
        all your notes in trash?`,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      action: 'confirm',
      actionTextColor: '#fff',
      actionBgColor: '#cf252e',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.emptyTrash();
      }
    });
  }

  emptyTrash() {
    this.noteService.emptyTrash().subscribe(
      () => {
        console.log('Trash emptied successfully!');
        this.snackbarService.show('Trash emptied successfully');
        this.loadDeletedNotes();
      },
      (error) => {
        console.error('Error emptying trash:', error);
        this.snackbarService.show('Error emptying trash', 'Retry');
      }
    );
  }

  trackByNoteId(index: number, note: any): number {
    return note.id;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
