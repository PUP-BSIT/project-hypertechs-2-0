import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TaskService } from '../../../services/tasks/task.service';
import { Subscription } from 'rxjs';
import { simpleFade, slideInOut } from '../../../animations/element-animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [simpleFade, slideInOut],
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() firstname: string | null = null;
  @Input() note: any;
  notes: any[] = [];
  isLoading = true;
  userTasks: any[] = [];
  private userSubscription!: Subscription;
  private tasksSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private titleCaseService: TitleCaseService,
    private noteService: NoteService,
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.userService.firstname$.subscribe((firstname) => {
      this.firstname = this.titleCaseService.toTitleCase(firstname);
    });

    this.userSubscription = this.authService.user$.subscribe((userId) => {
      if (userId !== null) {
        this.loadNotes();
        this.loadTasks(); // Load tasks when user is logged in
      } else {
        this.notes = []; // Clear notes when no user is logged in
        this.isLoading = false; // Set loading to false if no user
      }
    });
  }

  loadNotes() {
    this.noteService.getNotes().subscribe(
      (data) => {
        console.log('Notes received from backend:', data);
        this.notes = data.filter((note: any) => note.is_deleted == 0);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false;
      }
    );
  }

  loadTasks() {
    this.tasksSubscription = this.taskService
      .getUserTasks('lastEdited')
      .subscribe(
        (tasks) => {
          console.log('Tasks received from backend:', tasks);
          this.userTasks = tasks.slice(0, 3);
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
  }

  onNoteDelete(noteId: number) {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  onTaskDeleted(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe(
      (response) => {
        if (response.success) {
          console.log('Task deleted successfully!');
          this.userTasks = this.userTasks.filter(
            (task) => task.task_id !== taskId
          );
        } else {
          console.error('Failed to delete task. Try again.');
        }
      },
      (error) => {
        console.error('Error deleting task', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  templates = [
    { icon: 'meeting_room', title: 'Meeting' },
    { icon: 'check_circle_outline', title: 'Tasks List' },
    { icon: 'assignment', title: 'Project Plan' },
    { icon: 'celebration', title: 'Event Plan' },
    { icon: 'school', title: 'Lectures' },
    { icon: 'today', title: 'Daily Planner' },
  ];

  selectTemplate(template: any) {
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

  trackByNoteId(index: number, note: any): number {
    return note.id;
  }

  trackByTaskId(index: number, task: any): number {
    return task.task_id;
  }
}
