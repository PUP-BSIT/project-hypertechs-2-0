import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private toolbarVisible = new BehaviorSubject<boolean>(true);
  toolbarVisible$ = this.toolbarVisible.asObservable();

  setToolbarVisible(visible: boolean) {
    this.toolbarVisible.next(visible);
  }
}
