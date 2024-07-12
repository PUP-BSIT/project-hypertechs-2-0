import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../services/tasks/task.service';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task: any;
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() pinStatusChange: EventEmitter<any> = new EventEmitter<any>();

  todoCount: number = 0;
  inProgressCount: number = 0;
  doneCount: number = 0;
  progress: number = 0;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.todoCount = JSON.parse(this.task.todo).length;
    this.inProgressCount = JSON.parse(this.task.in_progress).length;
    this.doneCount = JSON.parse(this.task.done).length;
    const totalCount = this.todoCount + this.inProgressCount + this.doneCount;
    this.progress = totalCount === 0 ? 0 : (this.doneCount / totalCount) * 100;
  }

  openTaskBoard() {
    this.router.navigate(['/main/board', { taskId: this.task.task_id }]);
  }

  confirmDeleteTask() {
    const dialogRef = this.dialogService.openDialog({
      title: 'Delete Task',
      content: 'Are you sure you want to delete? This cannot be undone.',
      cancelText: 'Cancel',
      confirmText: 'Delete',
      action: 'delete',
      actionTextColor: '#fff',
      actionBgColor: '#cf252e',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.deleteTask();
      }
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.task_id).subscribe(
      (response) => {
        if (response.success) {
          this.snackbarService.show('Task deleted successfully!');
          this.taskDeleted.emit(this.task.task_id);
        } else {
          this.snackbarService.show('Failed to delete task. Try again.');
        }
      },
      (error) => {
        console.error('Error deleting task', error);
      }
    );
  }

  togglePin() {
    const newPinStatus = !this.task.is_pinned;
    this.taskService.pinTask(this.task.task_id, newPinStatus).subscribe(
      (response) => {
        if (response.success) {
          this.task.is_pinned = newPinStatus;
          this.pinStatusChange.emit(this.task);

          const message = newPinStatus
            ? 'Task pinned successfully'
            : 'Task unpinned successfully';
          this.snackbarService.show(message, 'Close', 2000);
        } else {
          this.snackbarService.show(
            'Failed to update pin status. Please try again.'
          );
        }
      },
      (error) => {
        console.error('Error updating pin status', error);
        this.snackbarService.show(
          'An error occurred while updating pin status.'
        );
      }
    );
  }
}
