import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { TitleCaseService } from '../../../services/title-case.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Template {
  icon: string;
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  @Input() firstname: string | null = null;
  @Input() note: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private titleCaseService: TitleCaseService
  ) { }

  ngOnInit() {
    this.userService.firstname$.subscribe(firstname => {
      this.firstname = this.titleCaseService.toTitleCase(firstname);
    });
  }

  templates: Template[] = [
    { icon: 'meeting_room', title: 'Meeting' },
    { icon: 'check_circle_outline', title: 'Tasks List' },
    { icon: 'assignment', title: 'Project Plan' },
    { icon: 'celebration', title: 'Event Plan' },
    { icon: 'school', title: 'Lectures' },
    { icon: 'today', title: 'Daily Planner' }
  ];

  notes = [
    { id: 1, title: 'Note 1', content: 'This is a sample note 1.', lastEdited: new Date() },
    { id: 2, title: 'Note 2', content: 'This is a sample note 2', lastEdited: new Date() },
    { id: 3, title: 'Note 3', content: 'This is a sample note 3', lastEdited: new Date() },
    { id: 1, title: 'Note 4', content: 'This is a sample note 1', lastEdited: new Date() },
    { id: 2, title: 'Note 5', content: 'This is a sample note 2', lastEdited: new Date() },
    { id: 3, title: 'Note 6', content: 'This is a sample note 3', lastEdited: new Date() },
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.notes, event.previousIndex, event.currentIndex);
  }

  createNote() {
    
    console.log('Create Note button clicked');
  }

  useTemplate(template: Template) {
  
    console.log(`Using template: ${template.title}`);
  }
}
