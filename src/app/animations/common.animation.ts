import { AmtTiming, AmtTimingArg, MatAmtDuration, MatAmtFunction, MatAmtDurationKey, MatAmtFunctionKey, AmtTimingValue } from './animation';


export const MAT_AMT_DURATION = {
  faster: { string: '160ms', number: 160 },
  fast: { string: '200ms', number: 200 },
  normal: { string: '240ms', number: 240 },
  slow: { string: '280ms', number: 280 },
  slower: { string: '320ms', number: 320 }
} as const;

export const MAT_AMT_FUNCTION = {
  angular: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  deceleration: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  acceleration: 'cubic-bezier(0.4, 0.0, 1, 1)'
} as const;


type DisplayStyles<T> = {
  width: T, height: T, minWidth: T, minHeight: T, padding: T, margin: T
};
export function getDisplayStyles(): { hide: DisplayStyles<0>, show: DisplayStyles<'*'> } {
  return {
    show: { width: '*', height: '*', minWidth: '*', minHeight: '*', padding: '*', margin: '*' },
    hide: { width: 0, height: 0, minWidth: 0, minHeight: 0, padding: 0, margin: 0 }
  };
}


type DefaultTemplateTimingValue = { duration: MatAmtDurationKey; function: MatAmtFunctionKey; };
export function amtTimingInit(timing: AmtTimingArg, defaultMatTimingValue: DefaultTemplateTimingValue, isInOutAmt?: boolean): AmtTiming {
  const _defaultTimingValue = {
    duration: MAT_AMT_DURATION[defaultMatTimingValue.duration].number * (isInOutAmt ? 0.5 : 1),
    function: MAT_AMT_FUNCTION[defaultMatTimingValue.function]
  };


  if (timing === void 0) {
    return {
      enter: _defaultTimingValue,
      leave: _defaultTimingValue
    };
  } else {
    // @ts-ignore: 初期化
    let _entryTiming: AmtTiming = {};

    // @ts-ignore
    if (timing.enter) {
      // @ts-ignore
      const enterRef = timing.enter as { duration?: number, function?: string };
      _entryTiming.enter = {
        duration: enterRef.duration ? enterRef.duration * (isInOutAmt ? 0.5 : 1) : _defaultTimingValue.duration,
        function: enterRef.function || _defaultTimingValue.function
      };
    }

    // @ts-ignore
    if (timing.leave) {
      // @ts-ignore
      const leaveRef = timing.leave as { duration?: number, function?: string };
      _entryTiming.leave = {
        duration: leaveRef.duration ? leaveRef.duration * (isInOutAmt ? 0.5 : 1) : _defaultTimingValue.duration,
        function: leaveRef.function || _defaultTimingValue.function
      };
    } else {
      // 型が確定 => timing as { duration } | { function } | { duration, function }

      const _entryTimingValue: AmtTimingValue = {
        // @ts-ignore: デフォルトで 値に ｘ0.5(つまり、2倍速) にしている理由は、enter leave 合わせての秒数と判別するため
        duration: timing.duration * (isInOutAmt ? 0.25 : 0.5) || _defaultTimingValue.duration,
        // @ts-ignore
        function: timing.function || _defaultTimingValue.function
      };
      _entryTiming = {
        enter: _entryTimingValue,
        leave: _entryTimingValue
      };
    }

    return _entryTiming;
  }
}
