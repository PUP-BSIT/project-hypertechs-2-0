import {
  trigger,
  transition,
  style,
  query,
  animateChild,
  group,
  animate,
} from '@angular/animations';

export const RouteTransitionAnimations = trigger('triggerName', [
    transition(
    `landing => login,
    landing => signup,
    login => landing,
    login => signup,
    login => recovery,
    signup => login,
    signup => landing,
    recovery => landing`,
    [   
      style({ opacity: 0 }),
      animate('750ms ease-out', style({ opacity: 1 })),
    ]
  ),
]);

/* Sliding Route Animation

export const RouteTransitionAnimations = trigger('triggerName', [
  transition('landing => login, login => signup, landing => signup', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ transform: 'translateX(100%)', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate(
          '1500ms ease-out',
          style({ transform: 'translateX(-100%)', opacity: 0 })
        ),
      ]),
      query(':enter', [
        animate(
          '1500ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    query(':enter', animateChild()),
  ]),
  transition('signup => login, login => landing, signup => landing', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [style({ transform: 'translateX(-100%)', opacity: 0 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [
        animate(
          '1500ms ease-out',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
      query(':enter', [
        animate(
          '1500ms ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    query(':enter', animateChild()),
  ]),
]);

*/
