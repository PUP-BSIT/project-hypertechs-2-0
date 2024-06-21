import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarService } from '../../../../services/toolbar/toolbar.service';
import { Location } from '@angular/common';
import { NoteService } from '../../../../services/notes/note.service';
import { NgForm } from '@angular/forms';
import { slideInOut, simpleFade } from '../../../../animations/element-animations';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';
import { templates } from '../../../../imports/templates';
import { interval, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth/auth.service';

type EditableProperty = 'textColor' | 'backgroundColor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  animations: [slideInOut, simpleFade],
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContent') editorContentRef!: ElementRef;
  @ViewChild('noteForm') noteForm!: NgForm;

  activeCommands: { [key: string]: boolean } = {};
  lastEdited = new Date();
  textColor!: string;
  backgroundColor!: string;
  noteTitle = '';
  noteContent = '';
  noteId: number | null = null;
  autoSaveInterval: any;
  contentChanged = new Subject<void>();
  private snackbarDuration: number = 3000;
  readOnly = false;

  private readonly COMMANDS = [
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'justifyFull',
    'insertUnorderedList',
    'insertOrderedList',
    'indent',
    'outdent',
    'foreColor',
    'backColor',
  ];

  constructor(
    private toolbarService: ToolbarService,
    private location: Location,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.initializeToolbar();
    this.loadNoteOrTemplate();

    this.autoSaveInterval = interval(30000).subscribe(() => {
      this.saveNote();
    });

    this.contentChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.saveNote();
    });
  }

  ngOnDestroy() {
    this.toolbarService.setToolbarVisible(true);

    // Check if any changes have been made before showing the snackbar
    if (this.noteContent.trim() !== '' || this.noteTitle.trim() !== '') {
      this.snackbarService.show(
        'Note saved successfully!', 
        'Close', 
        this.snackbarDuration
      );
    }

    if (this.autoSaveInterval) {
      this.autoSaveInterval.unsubscribe();
    }
  }

  private initializeToolbar() {
    this.toolbarService.setToolbarVisible(false);
    this.updateActiveCommands();
  }

  private loadNoteOrTemplate() {
    this.route.params.subscribe(async (params) => {
      if (params['id']) {
        this.noteId = +params['id'];
        await this.loadNote();
      } else if (params['template']) {
        this.loadTemplate(params['template']);
      }
    });
  }

  private async loadNote() {
    if (this.noteId !== null) {
      try {
        const note = await this.noteService
          .getNoteById(this.noteId)
          .toPromise();
        this.noteTitle = note.title;
        this.noteContent = note.content;
        this.lastEdited = new Date(note.last_edited);
        this.editorContentRef.nativeElement.innerHTML = this.noteContent;
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    }
  }

  private loadTemplate(template: string) {
    const selectedTemplate = templates[template];
    if (selectedTemplate) {
      this.noteTitle = selectedTemplate.title;
      this.noteContent = selectedTemplate.content;
      this.editorContentRef.nativeElement.innerHTML = this.noteContent;
    }
  }

  format(command: string, value?: string) {
    if (
      command === 'foreColor' ||
      command === 'backColor' ||
      command === 'fontSize' ||
      command === 'formatBlock'
    ) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false);
    }
    this.updateActiveCommands();
    if (['insertUnorderedList', 'insertOrderedList'].includes(command)) {
      this.addListClass();
    }
  }

  private addListClass() {
    const editorContent = this.editorContentRef.nativeElement;
    const lists = editorContent.querySelectorAll('ul, ol');
    lists.forEach((list: HTMLElement) => list.classList.add('custom-list'));
  }

  formatBlock(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tag = selectElement.value;
    this.format('formatBlock', tag);
  }

  onFontSizeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.format('fontSize', selectElement.value);
  }

  changeTextColor(event: Event) {
    this.changeColor(event, 'foreColor', 'textColor');
  }

  changeBackgroundColor(event: Event) {
    this.changeColor(event, 'backColor', 'backgroundColor');
  }

  private changeColor(
    event: Event,
    command: string,
    property: EditableProperty
  ) {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      this.format(command, target.value);
      this[property] = target.value;
    }
  }

  private updateActiveCommands() {
    this.COMMANDS.forEach((command) => {
      this.activeCommands[command] = document.queryCommandState(command);
    });
  }

  onContentChange(event: Event) {
    this.noteContent = (event.target as HTMLElement).innerHTML;
    this.contentChanged.next();
  }

  onTitleChange() {
    this.contentChanged.next();
  }

  // Save/Update the note
  async saveNote() {
    console.log('Saving note with data:', {
      id: this.noteId,
      title: this.noteTitle,
      content: this.noteContent,
      lastEdited: this.lastEdited,
      user_id: this.authService.getUserId(),
    });

    this.lastEdited = new Date();

    const noteData = {
      id: this.noteId,
      title: this.noteTitle || 'Untitled',
      content: this.noteContent,
      lastEdited: this.lastEdited.toISOString(),
      user_id: this.authService.getUserId(),
    };

    try {
      if (this.noteId !== null) {
        const response = await this.noteService
          .updateNote(this.noteId, noteData)
          .toPromise();
        console.log('Note updated:', response);
      } else {
        const response = await this.noteService.saveNote(noteData).toPromise();
        console.log('Note saved:', response);
        this.noteId = response.id;
        console.log('New note ID set:', this.noteId);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  // Return to notes list
  goBack() {
    this.location.back();
  }

  // Toggle between edit and read-only modes
  toggleEditMode() {
    this.readOnly = !this.readOnly;
  }
}
