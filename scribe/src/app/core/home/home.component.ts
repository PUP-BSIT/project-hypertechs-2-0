import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';

interface Template {
  icon: string;
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @Input() firstname: string | null = null;
  @Input() note: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private titleCaseService: TitleCaseService
  ) {}

  ngOnInit() {
    this.userService.firstname$.subscribe((firstname) => {
      this.firstname = this.titleCaseService.toTitleCase(firstname);
    });
  }

  templates: Template[] = [
    { icon: 'meeting_room', title: 'Meeting' },
    { icon: 'check_circle_outline', title: 'Tasks List' },
    { icon: 'assignment', title: 'Project Plan' },
    { icon: 'celebration', title: 'Event Plan' },
    { icon: 'school', title: 'Lectures' },
    { icon: 'today', title: 'Daily Planner' },
  ];
}
