import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from '../../../../services/notes/note.service';

@Component({
  selector: 'app-lock-dialog',
  templateUrl: './lock-dialog.component.html',
  styleUrls: ['./lock-dialog.component.scss'],
})
export class LockDialogComponent {
  passwordForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    if (this.passwordForm.valid) {
      const password = this.passwordForm.get('password')?.value;

      if (this.data.noteId) {
        this.noteService
          .checkNotePassword(this.data.noteId, password)
          .subscribe(
            (isCorrect) => {
              if (isCorrect) {
                this.dialogRef.close({ password: password });
              } else {
                this.passwordForm
                  .get('password')
                  ?.setErrors({ incorrectPassword: true });
              }
            },
            (error) => {
              console.error('Error checking password:', error);
            }
          );
      } else {
        this.dialogRef.close({ password: password });
      }
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
