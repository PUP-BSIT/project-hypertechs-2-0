import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  show(
    message: string,
    action: string = 'Close',
    duration: number = 5000,
    actionCallback?: () => void,
    verticalPosition: 'top' | 'bottom' = 'bottom',
  ) {
    let snackBarRef: MatSnackBarRef<SimpleSnackBar>;

    snackBarRef = this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: verticalPosition,
      horizontalPosition: 'center',
    });

    if (actionCallback) {
      snackBarRef.onAction().subscribe(() => {
        actionCallback();
      });
    }
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
