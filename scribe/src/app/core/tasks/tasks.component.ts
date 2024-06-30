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
  sortOption: string = 'lastEdited';

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  loadTasks() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    this.tasksSubscription = this.taskService
      .getUserTasks(this.sortOption)
      .subscribe((tasks) => {
        this.userTasks = tasks;
      });
  }

  changeSortOption(option: string) {
    this.sortOption = option;
    this.loadTasks();
  }

  getSortOptionLabel(): string {
    switch (this.sortOption) {
      case 'dateCreated':
        return 'Date Created';
      case 'titleAsc':
        return 'Title (A to Z)';
      case 'titleDesc':
        return 'Title (Z to A)';
      case 'lastEdited':
      default:
        return 'Last Edited';
    }
  }

  onTaskDeleted(taskId: number) {
    this.userTasks = this.userTasks.filter((task) => task.task_id !== taskId);
  }

  trackByTaskId(index: number, task: any): number {
    return task.task_id;
  }
}
