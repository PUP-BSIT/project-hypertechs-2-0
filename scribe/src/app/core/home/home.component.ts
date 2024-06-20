import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';
import { FeaturedTemplates } from '../../../models/model';

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

  templates: FeaturedTemplates[] = [
    { icon: 'meeting_room', title: 'Meeting' },
    { icon: 'check_circle_outline', title: 'Tasks List' },
    { icon: 'assignment', title: 'Project Plan' },
    { icon: 'celebration', title: 'Event Plan' },
    { icon: 'school', title: 'Lectures' },
    { icon: 'today', title: 'Daily Planner' },
  ];

  selectTemplate(template: FeaturedTemplates) {
    switch (template.title) {
      case 'Meeting':
        this.router.navigate(['/main/editor', { template: 'meeting' }]);
        break;
      case 'Tasks List':
        this.router.navigate(['/main/editor', { template: 'tasksList' }]);
        break;
      case 'Project Plan':
        this.router.navigate(['/main/editor', { template: 'projectPlan' }]);
        break;
      case 'Event Plan':
        this.router.navigate(['/main/editor', { template: 'eventPlan' }]);
        break;
      case 'Lectures':
        this.router.navigate(['/main/editor', { template: 'lectures' }]);
        break;
      case 'Daily Planner':
        this.router.navigate(['/main/editor', { template: 'dailyPlanner' }]);
        break;
      default:
        console.log('Template not found');
    }
  }
}
