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


export const AMT_DISPLAY_STYLES = {
  show: { width: '*', height: '*', minWidth: '*', minHeight: '*', padding: '*', margin: '*' },
  hide: { width: 0, height: 0, minWidth: 0, minHeight: 0, padding: 0, margin: 0 }
} as const;
