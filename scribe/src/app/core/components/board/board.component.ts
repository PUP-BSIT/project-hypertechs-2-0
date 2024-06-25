import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SidenavService } from '../../../../services/sidenav/sidenav.service';

/* Custom Imports */
import {
  slideUpDown,
  simpleFade,
} from '../../../../animations/element-animations';
import { ToolbarService } from '../../../../services/toolbar/toolbar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';

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
export class BoardComponent implements AfterViewInit, OnDestroy {
  isInTrash: boolean = false;
  taskTitle: string = '';
  taskDescription: string = '';

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(
    private toolbarService: ToolbarService,
    private location: Location,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private sidenavService: SidenavService
  ) {}

  ngAfterViewInit() {
    this.initializeToolbar();
  }

  ngOnDestroy() {
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

  addTask(event: any, board: string) {
    const task = event.target.value.trim();
    if (!task) return;

    const newTask: Task = { text: task, editing: false };

    if (board === 'todo') {
      this.todoTasks.push(newTask);
    } else if (board === 'inProgress') {
      this.inProgressTasks.push(newTask);
    }
    event.target.value = '';
  }

  deleteTask(task: Task, board: string) {
    if (board === 'todo') {
      this.todoTasks = this.todoTasks.filter((t) => t !== task);
    } else if (board === 'inProgress') {
      this.inProgressTasks = this.inProgressTasks.filter((t) => t !== task);
    } else if (board === 'done') {
      this.doneTasks = this.doneTasks.filter((t) => t !== task);
    }
  }

  moveToDone(task: Task, board: string) {
    this.deleteTask(task, board);
    task.previousBoard = board; // Store the previous board
    this.doneTasks.push(task);
  }

  clearAll(board: string) {
    if (board === 'todo') {
      this.todoTasks = [];
    } else if (board === 'inProgress') {
      this.inProgressTasks = [];
    } else if (board === 'done') {
      this.doneTasks = [];
    }
  }

  editTask(task: Task, board: string) {
    task.editing = true;
  }

  saveTask(task: Task) {
    task.editing = false;
  }

  moveBackToPreviousBoard(task: Task) {
    if (task.previousBoard === 'todo') {
      this.todoTasks.push(task);
    } else if (task.previousBoard === 'inProgress') {
      this.inProgressTasks.push(task);
    }
    this.doneTasks = this.doneTasks.filter((t) => t !== task);
    delete task.previousBoard; // Remove previous board information
  }
}
