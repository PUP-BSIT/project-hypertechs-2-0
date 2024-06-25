import { Component } from '@angular/core';
import { simpleFade } from '../../../animations/element-animations';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  animations: [simpleFade],
})
export class TasksComponent {
  tasks = [
    {
      title: 'Task Title 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      progress: 100,
    },
    {
      title: 'Task Title 2',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      progress: 50,
    },
    {
      title: 'Task Title 3',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      progress: 75,
    },
    {
      title: 'Task Title 4',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      progress: 20,
    },
    {
      title: 'Task Title 5',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      progress: 90,
    },
  ];
}
