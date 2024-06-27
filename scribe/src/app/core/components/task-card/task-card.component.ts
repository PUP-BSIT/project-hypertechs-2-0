import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() task: any;

  todoCount: number = 0;
  inProgressCount: number = 0;
  doneCount: number = 0;
  progress: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.todoCount = JSON.parse(this.task.todo).length;
    this.inProgressCount = JSON.parse(this.task.in_progress).length;
    this.doneCount = JSON.parse(this.task.done).length;
    const totalCount = this.todoCount + this.inProgressCount + this.doneCount;
    this.progress = totalCount === 0 ? 0 : (this.doneCount / totalCount) * 100;
  }

  openTaskBoard() {
    console.log('Task object:', this.task);
    console.log('Task ID:', this.task.task_id);
    this.router.navigate(['/main/board', { taskId: this.task.task_id }]);
  }
  
}
