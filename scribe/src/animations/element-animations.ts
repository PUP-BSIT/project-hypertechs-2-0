import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

/* Animation 1: Slide In-Out */
export const slideInOut = trigger('slideInOut', [
  state('in', style({
    transform: 'translateX(0)'
  })),
  transition('void => *', [
    style({
      transform: 'translateX(-100%)',
      opacity: 0,
      'will-change': 'transform, opacity' // Optimize for GPU acceleration
    }),
    animate('800ms ease-out')
  ]),
  transition('* => void', [
    animate('800ms ease-out', style({
      transform: 'translateX(-100%)',
      opacity: 0 
    }))
  ])
]);

/* Animation 2: Simple Fade */
export const simpleFade = trigger('simpleFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('800ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('800ms', style({ opacity: 0 }))
  ])
]);

/* Animation 3: Typing Effect 
export const typingAnimation = trigger('typingAnimation', [
  transition(':enter', [
    style({ 'white-space': 'nowrap', 'overflow': 'hidden', 'width': '*' }),
    animate('500ms', style({ 'width': '1' })), 
  ]),
]);
*/