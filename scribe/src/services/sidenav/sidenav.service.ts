// sidenav.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private isOpenedSubject = new BehaviorSubject<boolean>(true);
  isOpened$ = this.isOpenedSubject.asObservable();

  constructor() {}

  toggle() {
    this.isOpenedSubject.next(!this.isOpenedSubject.value);
  }

  open() {
    this.isOpenedSubject.next(true);
  }

  close() {
    this.isOpenedSubject.next(false);
  }
}
