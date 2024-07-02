import { Component, OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { DialogService } from '../../../services/dialog/dialog.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';
import { simpleFade, slideInOut } from '../../../animations/element-animations';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss'],
  animations: [simpleFade, slideInOut],
})
export class TrashComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  paginatedNotes: any[] = [];
  isLoading = true;
  pageSize = 25;
  currentPage = 0;
  showFirstLastButtons = true;
  currentSortOption = 'lastEdited';
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
        this.paginatedNotes = [];
        this.isLoading = false;
      }
    });
  }

  loadDeletedNotes() {
    this.isLoading = true;
    this.noteService.getDeletedNotes(this.currentSortOption).subscribe(
      (data: any[]) => {
        console.log('Deleted notes received from backend:', data);
        this.notes = data;
        this.paginateNotes();
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

  paginateNotes() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedNotes = this.notes.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateNotes();
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
    this.paginateNotes();
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  hardDeleteNote(noteId: number) {
    this.noteService.hardDeleteNote(noteId).subscribe(
      () => {
        console.log('Note permanently deleted successfully');
        this.notes = this.notes.filter((note) => note.id !== noteId);
        this.paginateNotes();
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
    this.isLoading = true;
    this.noteService.emptyTrash().subscribe(
      () => {
        console.log('Trash emptied successfully!');
        this.snackbarService.show('Trash emptied successfully');
        this.loadDeletedNotes();
      },
      (error) => {
        console.error('Error emptying trash:', error);
        this.snackbarService.show('Error emptying trash', 'Retry');
        this.isLoading = false;
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

  sortNotes(option: string) {
    this.currentSortOption = option;
    this.loadDeletedNotes();
  }

  get currentSortOptionLabel() {
    switch (this.currentSortOption) {
      case 'dateCreated':
        return 'Date Created';
      case 'titleAsc':
        return 'Title (A to Z)';
      case 'titleDesc':
        return 'Title (Z to A)';
      case 'lastEdited':
      default:
        return 'Last Edited';
    }
  }
}
