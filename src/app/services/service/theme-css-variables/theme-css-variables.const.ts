// angular material の @angular/material/theming/_palette.scss を参考に編成
export type ThemeCssVariableKeys = [
  // background
  'base', 'opposite-base',
  'background', 'primary-container', 'secondary-container', 'tertiary-container', 'disabled-container',

  // content
  'divider', 'elevation', 'scrollbar',

  // text
  'text', 'secondary-text', 'hint-text', 'disabled-text',

  // theme palette
  'primary', 'primary-contrast',
  'accent',  'accent-contrast',
  'warn',    'warn-contrast',

  'primary-lighter', 'primary-darker', 'primary-lighter-contrast', 'primary-darker-contrast',
   'accent-lighter',  'accent-darker',  'accent-lighter-contrast',  'accent-darker-contrast',
     'warn-lighter',    'warn-darker',    'warn-lighter-contrast',    'warn-darker-contrast',
];
export type ThemeCssVariable = {
  [key in ThemeCssVariableKeys[number]]: string;
};
export type MinThemeCssVariable = {
  [key in ThemeCssVariableKeys[number]]?: string;
};


export const MIN_THEME_CSS_VARIABLE = {
  base: 'white',
  'opposite-base': 'black',
  background: '#f5f5f5',
  'primary-container': '#fafafa',
  'secondary-container': 'white',
  'disabled-container': 'rgba(0,0,0,.12)',
} as const;


export const LIGHT_THEME_CSS_VARIABLE: ThemeCssVariable = {
  // background
  base: 'white',
  'opposite-base': 'black',
  background: '#f5f5f5',
  'primary-container': '#fafafa',
  'secondary-container': 'white',
  'tertiary-container': '#eeeeee',
  'disabled-container': 'rgba(0,0,0,.12)',

  // content
  divider: 'rgba(0,0,0,.12)',
  elevation: 'black',
  scrollbar: 'rgba(0,0,0,.12)',

  // text
  text: 'rgba(0,0,0,.87)',
  'secondary-text': 'rgba(0,0,0,.54)',
  'hint-text': 'rgba(0,0,0,.38)',
  'disabled-text': 'rgba(0,0,0,.38)',

  // theme palette
  primary: '#673ab7',
  accent: '#ffd740',
  warn: '#f44336',
  'primary-contrast': '#fff',
  'accent-contrast': 'rgba(0,0,0,.87)',
  'warn-contrast': '#fff',

  'primary-lighter': '#d1c4c9',
  'primary-darker': '#512da8',
  'accent-lighter': '#ffe57f',
  'accent-darker': '#ffc400',
  'warn-lighter': '#ffcdd2',
  'warn-darker': '#d32f2f',

  'primary-lighter-contrast': 'rgba(0,0,0,.87)',
  'primary-darker-contrast': '#fff',
  'accent-lighter-contrast': 'rgba(0,0,0,.87)',
  'accent-darker-contrast': 'rgba(0,0,0,.87)',
  'warn-lighter-contrast': 'rgba(0,0,0,.87)',
  'warn-darker-contrast': '#fff'
};


export const DARK_THEME_CSS_VARIABLE: ThemeCssVariable = {
  // background
  base: 'black',
  'opposite-base': 'white',
  background: '#212121',
  'primary-container': '#303030',
  'secondary-container': '#424242',
  'tertiary-container': '#616161',
  'disabled-container': 'hsla(0,0%,100%,.12)',

  // content
  divider: 'rgba(255,255,255,.12)',
  elevation: 'black',
  scrollbar: 'rgba(255,255,255,.12)',

  // text
  text: 'white',
  'secondary-text': 'rgba(255,255,255,.7)',
  'hint-text': 'rgba(255,255,255,.5)',
  'disabled-text': 'hsla(0,0%,100%,.3)',

  // theme palette
  primary: '#388e3c',
  accent: '#ffd740',
  warn: '#f44336',
  'primary-contrast': '#fff',
  'accent-contrast': 'rgba(0,0,0,.87)',
  'warn-contrast': '#fff',

  'primary-lighter': '#4caf50',
  'primary-darker': '#1b5e20',
  'accent-lighter': '#ffe57f',
  'accent-darker': '#ffc400',
  'warn-lighter': '#ffcdd2',
  'warn-darker': '#d32f2f',

  'primary-lighter-contrast': 'rgba(0,0,0,.87)',
  'primary-darker-contrast': '#fff',
  'accent-lighter-contrast': 'rgba(0,0,0,.87)',
  'accent-darker-contrast': 'rgba(0,0,0,.87)',
  'warn-lighter-contrast': 'rgba(0,0,0,.87)',
  'warn-darker-contrast': '#fff'
};



/* template ------------------------

export const XYZ_THEME_CSS_VARIABLE: ThemeCssVariable = {
  // background
  base: '',
  'opposite-base': '',
  background: '',
  'primary-container': '',
  'secondary-container': '',
  'tertiary-container': '',
  'disabled-container': '',

  // content
  divider: '',
  elevation: '',
  scrollbar: '',

  // text
  text: '',
  'secondary-text': '',
  'hint-text': '',
  'disabled-text': '',

  // theme palette
  primary: '',
  accent: '',
  warn: '',
  'primary-contrast': '',
  'accent-contrast': '',
  'warn-contrast': '',

  'primary-lighter': '',
  'primary-darker': '',
  'accent-lighter': '',
  'accent-darker': '',
  'warn-lighter': '',
  'warn-darker': '',

  'primary-lighter-contrast': '',
  'primary-darker-contrast': '',
  'accent-lighter-contrast': '',
  'accent-darker-contrast': '',
  'warn-lighter-contrast': '',
  'warn-darker-contrast': '',
};

------------------------ */

