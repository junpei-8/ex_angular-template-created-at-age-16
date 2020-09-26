import { state, style, transition, animate, query, group, sequence } from '@angular/animations';
import { SelfAmtType, AmtTimingArg, AmtTiming } from './animation';
import { getDisplayStyles, amtTimingInit } from './common.animation';



export function selfOpacityFade(type: SelfAmtType, timing?: AmtTimingArg, additionalAmt?: (timing: AmtTiming) => any[]): any[] {
  const _timing = amtTimingInit(timing, { duration: 'normal', function: 'angular' });

  const entry = (type === 'true-false') ?
    [
      state('true', style({ opacity: 1, 'pointer-events': 'auto' })),
      state('false', style({ opacity: 0, 'pointer-events': 'none' })),


      transition('false => true', [
        animate(`${_timing.enter.duration} ${_timing.enter.function}`),
      ]),
      transition('true => false', [
        animate(`${_timing.leave.duration} ${_timing.leave.function}`),
      ])
    ]
  : [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),

      transition(':enter', [
        animate(`${_timing.enter.duration} ${_timing.enter.function}`)
      ]),
      transition(':leave', [
        animate(`${_timing.leave.duration} ${_timing.leave.function}`)
      ])
    ];

  return additionalAmt ? entry.concat(additionalAmt(_timing)) : entry;
}


/**
 * @description 親要素に指定する
 * @note 子要素には共通の width style をつけるのを忘れないようにする
 * @param timing アニメーションのタイミングを指定する
 */
export function opacityFadeOutIn(timing?: AmtTimingArg, additionalAmt?: (timing: AmtTiming) => any[]): any[] {
  const _timing = amtTimingInit(timing, { duration: 'normal', function: 'angular' }, true);

  const displayStyles = getDisplayStyles();

  const entry = [
    transition('true <=> false', [
      query(':leave, :enter', style({ overflow: 'hidden' }), { optional: true }),

      group([
        query(':leave', [
          style({ ...displayStyles.show, opacity: 1 }),
          sequence([
            animate(`${_timing.leave.duration} ${_timing.leave.function}`, style({ opacity: 0 })),
            style( displayStyles.hide )
          ])
        ], { optional: true }),
        query(':enter', [
          style({ ...displayStyles.hide, opacity: 0 }),
          sequence([
            animate(`0.0001 ${_timing.leave.duration}`, style( displayStyles.show )),
            animate(`${_timing.enter.duration} ${_timing.leave.function}`, style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ];

  return additionalAmt ? entry.concat(additionalAmt(_timing)) : entry;
}


/**
 * @description 親要素に指定する。
 * @param timing アニメーションのタイミングを指定する
 */
export function selfOpacityFadeOutIn(type: SelfAmtType, timing?: AmtTimingArg, additionalAmt?: (_timing: AmtTiming) => any[]): any[] {
  const _timing = amtTimingInit(timing, { duration: 'normal', function: 'angular' }, true);

  const displayStyles = getDisplayStyles();

  const entry = (type === 'true-false') ?
    [
      state('true', style({ ...displayStyles.show, opacity: 1 })),
      state('false', style({ ...displayStyles.hide, opacity: 0 })),

      transition('true => false', [
        style({ ...displayStyles.show, opacity: 1 }),
        animate(`${_timing.leave.duration} ${_timing.leave.function}`, style({ opacity: 0 }))
      ]),
      transition('false => true', [
        sequence([
          animate(`0.0001 ${_timing.leave.duration}`, style( displayStyles.show )),
          animate(`${_timing.enter.duration} ${_timing.leave.function}`, style({ opacity: 1 })),
        ]),
      ]),
    ]
  : [
      state('*', style({ ...displayStyles.show, opacity: 1 })),
      state('void',  style({ ...displayStyles.hide, opacity: 0 })),

      transition('* => void', [
        style({ ...displayStyles.show, opacity: 1 }),
        animate(`${_timing.leave.duration} ${_timing.leave.function}`, style({ opacity: 0 }))
      ]),
      transition('void => *', [
        sequence([
          animate(`0.0001 ${_timing.leave.duration}`, style( displayStyles.show )),
          animate(`${_timing.enter.duration} ${_timing.leave.function}`, style({ opacity: 1 })),
        ]),
      ]),
    ];

  return additionalAmt ? entry.concat(additionalAmt(_timing)) : entry;
}
