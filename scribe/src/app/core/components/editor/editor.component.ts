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
  noteTitle: string = '';
  noteContent: string = '';
  noteId: number | null = null;

  constructor(
    private toolbarService: ToolbarService,
    private location: Location,
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngAfterViewInit() {
    this.toolbarService.setToolbarVisible(false);
    this.updateActiveCommands();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.noteId = +params['id'];
        this.loadNote();
      } else if (params['template']) {
        this.loadTemplate(params['template']);
      }
    });
  }

  ngOnDestroy() {
    this.toolbarService.setToolbarVisible(true);
  }

  private loadNote() {
    if (this.noteId !== null) {
      this.noteService.getNoteById(this.noteId).subscribe(
        (note) => {
          this.noteTitle = note.title;
          this.noteContent = note.content;
          this.lastEdited = new Date(note.last_edited);
          this.editorContentRef.nativeElement.innerHTML = this.noteContent;
        },
        (error) => {
          console.error('Error fetching note:', error);
        }
      );
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
    if (command === 'foreColor' || command === 'backColor') {
      document.execCommand(command, false, value);
    } else if (command === 'fontSize') {
      document.execCommand('fontSize', false, value);
    } else {
      document.execCommand(command, false);
    }
    this.updateActiveCommands();

    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      this.addListClass();
    }
  }

  private addListClass() {
    const editorContent = this.editorContentRef.nativeElement;
    const lists = editorContent.querySelectorAll('ul, ol');
    lists.forEach((list: HTMLElement) => {
      list.classList.add('custom-list');
    });
  }

  formatBlock(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tag = selectElement.value;
    document.execCommand('formatBlock', false, tag);
    this.updateActiveCommands();
  }

  onFontSizeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const fontSize = selectElement.value;
    this.format('fontSize', fontSize);
  }

  private changeColor(event: Event, command: string, property: string) {
    const target = event.target as HTMLInputElement;
    if (target && target.value) {
      const color = target.value;
      this.format(command, color);
      if (property === 'textColor' || property === 'backgroundColor') {
        this[property] = color;
      }
    }
  }

  changeTextColor(event: Event) {
    this.changeColor(event, 'foreColor', 'textColor');
  }

  changeBackgroundColor(event: Event) {
    this.changeColor(event, 'backColor', 'backgroundColor');
  }

  private updateActiveCommands() {
    const commands = [
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
    commands.forEach((command) => {
      this.activeCommands[command] = document.queryCommandState(command);
    });
  }

  onContentChange(event: Event) {
    const content = (event.target as HTMLElement).innerHTML;
    this.noteContent = content;
  }

  saveNote() {
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

    if (this.noteId !== null) {
      this.noteService.updateNote(this.noteId, noteData).subscribe(
        (response) => {
          console.log('Note updated:', response);
          this.snackbarService.show('Note updated!');
        },
        (error) => {
          console.error('Error updating note:', error);
          alert('Error updating note!');
        }
      );
    } else {
      // For new notes, create a new note without an ID
      this.noteService.saveNote(noteData).subscribe(
        (response) => {
          console.log('Note saved:', response);
          this.noteId = response.id; // Set the new note ID
          this.snackbarService.show('Note saved!');
        },
        (error) => {
          console.error('Error saving note:', error);
          alert('Error saving note!');
        }
      );
    }
  }

  goBack() {
    this.location.back();
  }
}
