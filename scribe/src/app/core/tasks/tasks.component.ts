import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaskService } from '../../../services/tasks/task.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { simpleFade } from '../../../animations/element-animations';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [simpleFade],
})
export class TasksComponent implements OnInit, OnDestroy {
  userTasks: any[] = [];
  paginatedTasks: any[] = [];
  sortOption: string = 'lastEdited';
  pageSize = 25;
  currentPage = 0;
  isLoading = true;
  private tasksSubscription: Subscription | undefined;

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
    this.isLoading = true;
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    this.tasksSubscription = this.taskService
      .getUserTasks(this.sortOption)
      .subscribe((tasks) => {
        this.userTasks = tasks;
        this.paginateTasks();
        this.isLoading = false;
      });
  }

  paginateTasks() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.userTasks.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.paginateTasks();
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
    this.paginateTasks();
  }

  trackByTaskId(index: number, task: any): number {
    return task.task_id;
  }
}
