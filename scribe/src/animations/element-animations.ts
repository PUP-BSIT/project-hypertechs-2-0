import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

/* Animation 1: Slide In-Out */
export const slideInOut = trigger('slideInOut', [
  state(
    'in',
    style({
      transform: 'translateX(0)',
    })
  ),
  transition('void => *', [
    style({
      transform: 'translateX(-100%)',
      opacity: 0,
    }),
    animate('700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'),
  ]),
  transition('* => void', [
    animate(
      '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      style({
        transform: 'translateX(-100%)',
        opacity: 0,
      })
    ),
  ]),
]);

/* Animation 2: Simple Fade */
export const simpleFade = trigger('simpleFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('700ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('700ms', style({ opacity: 0 }))]),
]);
