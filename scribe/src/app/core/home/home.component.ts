import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { TitleCaseService } from '../../../services/title-case/title-case.service';
import { FeaturedTemplates } from '../../../models/model';
import { NoteService } from '../../../services/notes/note.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // Corrected from 'styleUrl'
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() firstname: string | null = null;
  @Input() note: any;
  notes: any[] = [];
  isLoading = true; // Add this flag
  private userSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private titleCaseService: TitleCaseService,
    private noteService: NoteService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.firstname$.subscribe((firstname) => {
      this.firstname = this.titleCaseService.toTitleCase(firstname);
    });

    this.userSubscription = this.authService.user$.subscribe((userId) => {
      if (userId !== null) {
        this.loadNotes();
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
        this.notes = data;
        this.isLoading = false; // Set the flag to false when loading is complete
      },
      (error) => {
        console.error('Error fetching notes:', error);
        this.isLoading = false; // Set the flag to false even on error
      }
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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

  trackByNoteId(index: number, note: any): number {
    return note.id; // or whatever unique identifier your notes have
  }
}
