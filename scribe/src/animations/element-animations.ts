import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
  group,
  query,
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
      '200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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

/* Animation 3: Slide Up-Down */
export const slideUpDown = trigger('slideUpDown', [
  transition(':enter', [
    style({ transform: 'translateY(50%)', opacity: 0 }),
    animate(
      '1000ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({ transform: 'translateY(0)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    animate(
      '1000ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({ transform: 'translateY(100%)', opacity: 0 })
    ),
  ]),
]);

/* Animation 4: Task Animation */
export const taskAnimation = trigger('taskAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(50%)' }),
    animate(
      '600ms cubic-bezier(.09,.01,.22,.99)',
      style({ opacity: 1, transform: 'translateY(0)' })
    ),
  ]),
  transition(':leave', [
    animate(
      '600ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({ opacity: 0, transform: 'translateX(-50%)' })
    ),
  ]),
]);

/* Animation 5: half Slide Animation */
export const halfSlide = trigger('halfSlide', [
  transition(':enter', [
    style({ transform: 'translateY(25%)', opacity: 0 }),
    animate(
      '1000ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({ transform: 'translateY(0)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    animate(
      '1000ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({ transform: 'translateY(100%)', opacity: 0 })
    ),
  ]),
]);

// Animation 6: Slide Left-Right for Steps
export const slideLeftRightSteps = trigger('slideLeftRightSteps', [
  transition(':increment', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
      optional: true,
    }),
    group([
      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate(
            '500ms ease-in-out',
            style({ transform: 'translateX(0%)', opacity: 1 })
          ),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)', opacity: 1 }),
          animate(
            '500ms ease-in-out',
            style({ transform: 'translateX(-100%)', opacity: 0 })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
  transition(':decrement', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), {
      optional: true,
    }),
    group([
      query(
        ':enter',
        [
          style({ transform: 'translateX(-100%)', opacity: 0 }),
          animate(
            '500ms ease-in-out',
            style({ transform: 'translateX(0%)', opacity: 1 })
          ),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)', opacity: 1 }),
          animate(
            '500ms ease-in-out',
            style({ transform: 'translateX(100%)', opacity: 0 })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);

/* Animation 7: Simple Fade */
export const searchFade = trigger('searchFade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('700ms', style({ opacity: 1 })),
  ]),
]);