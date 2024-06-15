// title-case.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TitleCaseService {

  constructor() { }

  toTitleCase(name: string | null): string {
    if (!name) {
      return '';
    }
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + 
      word.slice(1).toLowerCase()).join(' ');
  }
}
