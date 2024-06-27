import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../../services/tasks/task.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { simpleFade } from '../../../animations/element-animations';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [simpleFade],
})
export class TasksComponent implements OnInit, OnDestroy {
  userTasks: any[] = [];
  private tasksSubscription: Subscription | undefined;

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tasksSubscription = this.taskService
      .getUserTasks()
      .subscribe((tasks) => {
        this.userTasks = tasks;
      });
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  onTaskDeleted(taskId: number) {
    this.userTasks = this.userTasks.filter((task) => task.task_id !== taskId);
  }
}
