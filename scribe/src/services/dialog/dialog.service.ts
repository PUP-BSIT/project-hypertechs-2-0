import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../app/layout/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(data: any) {
    return this.dialog.open(DialogComponent, {
      data: data,
      disableClose: true,
    });
  }

  openSuccessDialog(title: string, content: string) {
    return this.dialog.open(DialogComponent, {
      data: {
        title: title,
        content: content,
        confirmText: '', 
        cancelText: '',
      },
      disableClose: true,
    });
  }
}
