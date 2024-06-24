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
    }),
    animate('700ms ease-out')
  ]),
  transition('* => void', [
    animate('300ms ease-out', style({
      transform: 'translateX(-100%)',
      opacity: 0 
    }))
  ])
]);

/* Animation 2: Simple Fade */
export const simpleFade = trigger('simpleFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('700ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('700ms', style({ opacity: 0 }))
  ])
]);
