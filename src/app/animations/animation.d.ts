export type SelfAmtType = 'true-false' | 'enter-leave';

export type AmtDirection = 'top' | 'left' | 'right' | 'bottom';
export type AmtPosition = 'relative' | 'absolute' | 'fixed' | 'static';

export interface AmtTiming {
  leave: AmtTimingValue;
  enter: AmtTimingValue;
}
export interface AmtTimingValue {
  duration: number;
  function: string;
}

export type AmtTimingArg =
  { leave: AmtTimingValueArg } |
  { enter: AmtTimingValueArg } |
  { leave: AmtTimingValueArg; enter: AmtTimingValueArg } |
  AmtTimingValueArg;

export type AmtTimingValueArg =
  { duration: number; } |
  { function: string; } |
  { duration: number; function: string; } |
  undefined;


export type MatAmtDurationKey = 'faster' | 'fast' | 'normal' | 'slow' | 'slower';
export type MatAmtFunctionKey = 'angular' | 'standard' | 'deceleration' | 'acceleration';
export type MatAmtDuration = {
  [key in MatAmtDurationKey]: {
    string: string;
    number: number;
  }
};
export type MatAmtFunction = {
  [key in MatAmtFunctionKey]: string
};
