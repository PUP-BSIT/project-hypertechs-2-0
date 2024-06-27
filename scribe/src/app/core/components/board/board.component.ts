import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SidenavService } from '../../../../services/sidenav/sidenav.service';
import { TaskService } from '../../../../services/tasks/task.service';
import {
  slideUpDown,
  simpleFade,
} from '../../../../animations/element-animations';
import { ToolbarService } from '../../../../services/toolbar/toolbar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

interface Task {
  text: string;
  editing: boolean;
  previousBoard?: string;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [slideUpDown, simpleFade],
})
export class BoardComponent implements AfterViewInit, OnDestroy, OnInit {
  isInTrash: boolean = false;
  taskTitle: string = '';
  taskDescription: string = '';
  taskId!: number;

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  private saveSubject: Subject<void> = new Subject<void>();
  private saveSubscription: Subscription | undefined;

  constructor(
    private toolbarService: ToolbarService,
    private location: Location,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private sidenavService: SidenavService,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const taskId = params.get('taskId');
      if (taskId) {
        this.taskId = +taskId;
        this.loadTask();
      }
    });

    // Debounce save operations
    this.saveSubscription = this.saveSubject
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.saveBoard();
      });
  }

  ngAfterViewInit() {
    this.initializeToolbar();
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    this.toolbarService.setToolbarVisible(true);
    this.sidenavService.open();
  }

  private initializeToolbar() {
    this.toolbarService.setToolbarVisible(false);
  }

  goBack() {
    this.location.back();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  loadTask() {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe((taskData) => {
        this.taskTitle = taskData.title;
        this.taskDescription = taskData.description;
        this.todoTasks = JSON.parse(taskData.todo || '[]');
        this.inProgressTasks = JSON.parse(taskData.in_progress || '[]');
        this.doneTasks = JSON.parse(taskData.done || '[]');
      });
    }
  }

  addTask(event: any, board: string) {
    const task = event.target.value.trim();
    if (!task) return;

    const newTask: Task = { text: task, editing: false };

    if (board === 'todo') {
      this.todoTasks.push(newTask);
    } else if (board === 'inProgress') {
      this.inProgressTasks.push(newTask);
    } else if (board === 'done') {
      this.doneTasks.push(newTask);
    }
    event.target.value = '';

    this.triggerSave();
  }

  deleteTask(task: Task, board: string) {
    if (board === 'todo') {
      this.todoTasks = this.todoTasks.filter((t) => t !== task);
    } else if (board === 'inProgress') {
      this.inProgressTasks = this.inProgressTasks.filter((t) => t !== task);
    } else if (board === 'done') {
      this.doneTasks = this.doneTasks.filter((t) => t !== task);
    }
    this.triggerSave();
  }

  moveToDone(task: Task, board: string) {
    this.deleteTask(task, board);
    task.previousBoard = board;
    this.doneTasks.push(task);
    this.triggerSave();
  }

  clearAll(board: string) {
    if (board === 'todo') {
      this.todoTasks = [];
    } else if (board === 'inProgress') {
      this.inProgressTasks = [];
    } else if (board === 'done') {
      this.doneTasks = [];
    }
    this.triggerSave();
  }

  editTask(task: Task, board: string) {
    task.editing = true;
  }

  saveTask(task: Task) {
    task.editing = false;
    this.triggerSave();
  }

  moveBackToPreviousBoard(task: Task) {
    if (task.previousBoard === 'todo') {
      this.todoTasks.push(task);
    } else if (task.previousBoard === 'inProgress') {
      this.inProgressTasks.push(task);
    }
    this.doneTasks = this.doneTasks.filter((t) => t !== task);
    delete task.previousBoard;
    this.triggerSave();
  }

  triggerSave() {
    this.saveSubject.next();
  }

  saveBoard() {
    const taskData = {
      task_id: this.taskId,
      title: this.taskTitle || 'Untitled Task',
      description: this.taskDescription || 'No task description provided',
      todo: JSON.stringify(this.todoTasks),
      in_progress: JSON.stringify(this.inProgressTasks),
      done: JSON.stringify(this.doneTasks),
    };

    if (this.taskId) {
      this.taskService.updateTask(taskData).subscribe(
        (response) => {
          if (response.success) {
            console.log('Task updated successfully');
          } else {
            console.log('Failed to update task');
          }
        },
        (error) => {
          console.error('Error updating task', error);
        }
      );
    } else {
      this.taskService.saveTask(taskData).subscribe(
        (response) => {
          if (response.success) {
            this.taskId = response.task_id;
            console.log('Task saved successfully');
          } else {
            console.log('Failed to save task');
          }
        },
        (error) => {
          console.error('Error saving task', error);
        }
      );
    }
  }

  onTitleChange() {
    this.triggerSave();
  }

  onDescriptionChange() {
    this.triggerSave();
  }
}
