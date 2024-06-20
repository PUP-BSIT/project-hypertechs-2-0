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
    private snackbarService: SnackbarService
  ) {}

  ngAfterViewInit() {
    this.initializeToolbar();
    this.loadNoteOrTemplate();
  }

  ngOnDestroy() {
    this.toolbarService.setToolbarVisible(true);
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
        const note = await this.noteService.getNoteById(this.noteId).toPromise();
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
    if (command === 'foreColor' || command === 'backColor' || 
      command === 'fontSize' || command === 'formatBlock') {
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

  private changeColor(event: Event, command: string, property: EditableProperty) {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      this.format(command, target.value);
      this[property] = target.value;
    }
  }

  private updateActiveCommands() {
    this.COMMANDS.forEach(command => {
      this.activeCommands[command] = document.queryCommandState(command);
    });
  }

  onContentChange(event: Event) {
    this.noteContent = (event.target as HTMLElement).innerHTML;
  }

  async saveNote() {
    console.log('Note title:', this.noteTitle);
    console.log('Note content:', this.noteContent);
    console.log('Note last edited:', this.lastEdited);

    this.lastEdited = new Date(); // Update the last edited time

    const noteData = {
      id: this.noteId,
      title: this.noteTitle || 'Untitled',
      content: this.noteContent,
      lastEdited: this.lastEdited.toISOString(), // Ensure proper formatting
    };

    try {
      if (this.noteId !== null) {
        const response = 
          await this.noteService.updateNote(this.noteId, noteData).toPromise();
        console.log('Note updated:', response);
        this.snackbarService.show('Note updated!');
      } else {
        const response = await this.noteService.saveNote(noteData).toPromise();
        console.log('Note saved:', response);
        this.noteId = response.id; // Set the new note ID
        this.snackbarService.show('Note saved!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note!');
    }
  }

  goBack() {
    this.location.back();
  }
}
