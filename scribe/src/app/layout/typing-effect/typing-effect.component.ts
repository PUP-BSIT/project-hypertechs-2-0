import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-typing-effect',
  templateUrl: './typing-effect.component.html',
  styleUrls: ['./typing-effect.component.scss'],
})
export class TypingEffectComponent implements OnInit {
  text: string = 'Focus on what truly matters.\nNote-taking, redefined.';
  typedText: string = '';
  typingSpeed: number = 75;
  currentWordIndex: number = 0;
  currentLetterIndex: number = 0;
  words!: string[];

  @ViewChild('typedTextContainer', { static: true })
  typedTextContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.words = this.text.split(' ');
    this.typeText();
  }

  typeText(): void {
    if (this.currentWordIndex < this.words.length) {
      const word = this.words[this.currentWordIndex];
      const wordElement = this.renderer.createElement('span');
      if (word === 'redefined.') {
        this.renderer.setStyle(
          wordElement,
          'background',
          'linear-gradient(45deg, var(--highlight-prime), var(--highlight-sec))'
        );
        this.renderer.setStyle(wordElement, '-webkit-background-clip', 'text');
        this.renderer.setStyle(wordElement, 'background-clip', 'text');
        this.renderer.setStyle(
          wordElement,
          '-webkit-text-fill-color',
          'transparent'
        );
      }
      this.renderer.appendChild(
        this.typedTextContainer.nativeElement,
        wordElement
      );
      this.typeLetters(word, wordElement);
    }
  }

  typeLetters(word: string, wordElement: any): void {
    if (this.currentLetterIndex < word.length) {
      const letter = word[this.currentLetterIndex];
      wordElement.textContent += letter;
      this.currentLetterIndex++;
      setTimeout(() => this.typeLetters(word, wordElement), this.typingSpeed);
    } else {
      wordElement.textContent += ' '; // Add space after the word
      this.currentWordIndex++;
      this.currentLetterIndex = 0;
      this.typedText += word + ' ';
      setTimeout(() => this.typeText(), this.typingSpeed);
    }
  }
}
