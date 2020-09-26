import { trigger, transition, style, query, animateChild, animate, group, sequence } from '@angular/animations';
import { AmtTimingArg } from './animation';
import { getDisplayStyles, amtTimingInit } from './common.animation';

function routeOpacityFade(timing?: AmtTimingArg): any[] {
  const _timing = amtTimingInit(timing, { duration: 'slow', function: 'angular' }, true);

  const displayStyles = getDisplayStyles();

  return [
      query(':leave', animateChild(), { optional: true }),

      query(':leave, :enter', style({ overflow: 'hidden' }), { optional: true }),
      group([
        query(':leave', [
          style({ ...displayStyles.show, opacity: 1 }),
          sequence([
            animate(`${_timing.leave.duration}ms ${_timing.leave.function}`, style({ opacity: 0 })),
            style( displayStyles.hide )
          ])
        ], { optional: true }),
        query(':enter', [
          style({ ...displayStyles.hide, opacity: 0 }),
          sequence([
            animate(`0.001ms ${_timing.leave.duration}ms`, style( displayStyles.show )),
            animate(`${_timing.enter.duration}ms ${_timing.leave.function}`, style({ opacity: 1 }))
          ])
        ], { optional: true })
      ]),

      query(':enter', animateChild(), { optional: true }),
  ];
}

export const routeAnimation =
  trigger('routeAnimation', [
    transition(
      'Home => *, NotFound => *',
      routeOpacityFade()
    )
  ]);
