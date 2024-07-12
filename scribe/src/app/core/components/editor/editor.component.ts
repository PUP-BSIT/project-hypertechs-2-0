import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { interval, Subject, debounceTime } from 'rxjs';
import { SidenavService } from '../../../../services/sidenav/sidenav.service';
import { ThemeService } from '../../../../services/theme/theme.service';

/* Custom Imports */
import { templates } from '../../../../imports/templates';
import { slideUpDown, simpleFade, halfSlide } from '../../../../animations/element-animations';
import { ToolbarService } from '../../../../services/toolbar/toolbar.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { NoteService } from '../../../../services/notes/note.service';
import { SnackbarService } from '../../../../services/snackbar/snackbar.service';

type EditableProperty = 'textColor' | 'backgroundColor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  animations: [slideUpDown, simpleFade, halfSlide],
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContent') editorContentRef!: ElementRef;
  @ViewChild('noteForm') noteForm!: NgForm;
  @ViewChild('imageInput') imageInputRef!: ElementRef;

  activeCommands: { [key: string]: boolean } = {};
  lastEdited = new Date();
  textColor: string = '#000000';
  backgroundColor: string = '#000000';
  noteId: number | null = null;
  noteTitle: string | undefined;
  noteContent: string | undefined;
  autoSaveInterval: any;
  readOnly = false;
  isInTrash: boolean = false;
  initialNoteTitle: string | undefined;
  initialNoteContent: string | undefined;
  contentChanged = new Subject<void>();
  hasChanges = false;
  private lastScrollTop = 0;
  private isScrollingUp = false;
  selectedThemeColor: string = 'default';

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

  themeColors: { [key: string]: { dark: string; light: string } } = {
    default: { dark: '#101212', light: '#fbfffe' },
    red: { dark: '#77172e', light: '#edd6db' },
    orange: { dark: '#55200f', light: '#efdfda' },
    green: { dark: '#173125', light: '#d0eade' },
    sea: { dark: '#0c3836', light: '#d1eae8' },
    blue: { dark: '#172733', light: '#d8e5ef' },
    purple: { dark: '#2e2238', light: '#e8def0' },
    rose: { dark: '#422230', light: '#f5dce7' },
    brown: { dark: '#39342d', light: '#efe8dd' },
  };

  constructor(
    private toolbarService: ToolbarService,
    private location: Location,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private sidenavService: SidenavService,
    private themeService: ThemeService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.initializeToolbar();
    this.loadNoteOrTemplate();

    // Check for readonly query parameter
    this.route.queryParams.subscribe((params) => {
      if (params['readonly']) {
        this.readOnly = true;
        this.isInTrash = true; // Set isInTrash to true if readonly is true
      }
    });

    this.autoSaveInterval = interval(30000).subscribe(() => {
      this.saveNote();
    });

    this.contentChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.saveNote();
    });

    // Subscribe to selection change event
    this.editorContentRef.nativeElement.addEventListener('mouseup', () => {
      this.updateActiveCommands();
    });

    this.editorContentRef.nativeElement
      .closest('.scribe-editor-container')
      .addEventListener('scroll', this.onScroll.bind(this));

    this.themeService.currentTheme.subscribe((isDarkMode) => {
      this.applyThemeColor();
    });
  }

  private onScroll() {
    const scrollTop = this.editorContentRef.nativeElement.closest(
      '.scribe-editor-container'
    ).scrollTop;

    this.isScrollingUp = scrollTop < this.lastScrollTop;
    this.lastScrollTop = scrollTop;

    if (this.isScrollingUp) {
      this.showStickyContainer();
    } else {
      this.hideStickyContainer();
    }
  }

  private showStickyContainer() {
    const stickyContainer = document.querySelector('.sticky-container');
    if (stickyContainer) {
      stickyContainer.classList.remove('hide');
    }
  }

  private hideStickyContainer() {
    const stickyContainer = document.querySelector('.sticky-container');
    if (stickyContainer) {
      stickyContainer.classList.add('hide');
    }
  }

  ngOnDestroy() {
    this.toolbarService.setToolbarVisible(true);

    const hasTitleChanged =
      this.noteTitle?.trim() !== this.initialNoteTitle?.trim();
    const hasContentChanged =
      this.noteContent?.trim() !== this.initialNoteContent?.trim();

    if (
      (hasTitleChanged || hasContentChanged) &&
      ((this.noteContent && this.noteContent.trim() !== '') ||
        (this.noteTitle && this.noteTitle.trim() !== ''))
    ) {
      this.snackbarService.show('Note saved successfully!', 'Close', 3000);
    }

    if (this.autoSaveInterval) {
      this.autoSaveInterval.unsubscribe();
    }

    this.sidenavService.open();
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
        this.initialNoteTitle = note.title;
        this.initialNoteContent = note.content;
        this.lastEdited = new Date(note.last_edited);
        this.editorContentRef.nativeElement.innerHTML = this.noteContent;
        this.selectedThemeColor = note.theme_color;
        this.applyThemeColor();
        this.hasChanges = false;
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
      this.initialNoteTitle = selectedTemplate.title;
      this.initialNoteContent = selectedTemplate.content;
      this.editorContentRef.nativeElement.innerHTML = this.noteContent;
      this.hasChanges = false;
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
    this.hasChanges = true;
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

  changeThemeColor(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedThemeColor = selectElement.value;
    this.applyThemeColor();
    this.contentChanged.next();
    this.hasChanges = true; 
  }

  private applyThemeColor() {
    const isDarkMode = this.themeService.getCurrentTheme();
    const color =
      this.themeColors[this.selectedThemeColor][isDarkMode ? 'dark' : 'light'];

    const scribeEditorContainer = this.editorContentRef.nativeElement.closest(
      '.scribe-editor-container'
    );
    const stickyContainer = document.querySelector('.sticky-container');

    if (scribeEditorContainer) {
      this.renderer.setStyle(scribeEditorContainer, 'background-color', color);
      this.contentChanged.next();
    }
    if (stickyContainer) {
      this.renderer.setStyle(stickyContainer, 'background-color', color);
      this.contentChanged.next();
    }
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
      this.hasChanges = true;
    }
  }

  private updateActiveCommands() {
    this.COMMANDS.forEach((command) => {
      this.activeCommands[command] = document.queryCommandState(command);
    });
  }

  onContentChange(event: Event) {
    this.noteContent = (event.target as HTMLElement).innerHTML;
    this.hasChanges = true;
    this.contentChanged.next();
  }

  onTitleChange() {
    this.hasChanges = true;
    this.contentChanged.next();
  }

  async saveNote() {
    if (!this.hasChanges) {
      return;
    }

    console.log('Saving note with data:', {
      id: this.noteId,
      title: this.noteTitle,
      content: this.noteContent,
      lastEdited: this.lastEdited,
      user_id: this.authService.getUserId(),
      theme_color: this.selectedThemeColor,
    });

    this.lastEdited = new Date();

    const noteData = {
      id: this.noteId,
      title: this.noteTitle || 'Untitled',
      content: this.noteContent || '',
      lastEdited: this.lastEdited.toISOString(),
      user_id: this.authService.getUserId(),
      theme_color: this.selectedThemeColor,
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
      this.hasChanges = false; // Reset hasChanges after saving
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  goBack() {
    this.location.back();
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  toggleEditMode() {
    // Only allow toggle if not in read-only mode due to trash
    if (this.route.snapshot.queryParams['readonly']) {
      return;
    }
    this.readOnly = !this.readOnly;
  }

  scrollToTop() {
    const editorContainer = this.editorContentRef.nativeElement.closest(
      '.scribe-editor-container'
    );
    if (editorContainer) {
      editorContainer.scrollTop = 0;
      this.snackbarService.show(
        'You are at the top of the page.',
        'Dismiss',
        2000,
        undefined,
        'top'
      );
    }
  }

  scrollToBottom() {
    const editorContainer = this.editorContentRef.nativeElement.closest(
      '.scribe-editor-container'
    );
    if (editorContainer) {
      editorContainer.scrollTop = editorContainer.scrollHeight;
      this.snackbarService.show(
        'You are at the bottom of the page.',
        'Dismiss',
        2000,
        undefined,
        'top'
      );
    }
  }
}
