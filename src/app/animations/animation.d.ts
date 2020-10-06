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
