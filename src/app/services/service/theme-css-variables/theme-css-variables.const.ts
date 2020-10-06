import { ThemePaletteContrastType, ThemePaletteType, ThemeTextContrastColor } from './theme';

// angular materialの "@angular/material/theming/_palette.scss" を参考に編成
type ThemeBasicCssVariableKeys = [
  // background
  'base', 'opposite-base',
  'background', 'primary-container', 'secondary-container', 'tertiary-container', 'disabled-container',

  // content
  'divider', 'elevation', 'scrollbar',

  // text
  'text', 'secondary-text', 'hint-text', 'disabled-text',
];


export type ThemeCssVariableKey = ThemeBasicCssVariableKeys[number] | ThemePaletteType | ThemePaletteContrastType;

export type ThemeCssVariable = {
  [key in ThemeCssVariableKey]: string;
} & {
  text: ThemeTextContrastColor;
};

export type MinThemeCssVariable = {
  [key in ThemeCssVariableKey]?: string;
} & {
  text: ThemeTextContrastColor;
};


export const MIN_THEME_CSS_VARIABLE = {
  base: 'white',
  'opposite-base': 'black',
  background: '#f5f5f5',
  'primary-container': '#fafafa',
  'secondary-container': 'white',
  'disabled-container': 'rgba(0,0,0,.12)',
  primary: '#673ab7'
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
} as const;


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
  text: '#fff',
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
} as const;



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

  // 'primary-lighter': '',
  // 'primary-darker': '',
  // 'accent-lighter': '',
  // 'accent-darker': '',
  // 'warn-lighter': '',
  // 'warn-darker': '',

  // 'primary-lighter-contrast': '',
  // 'primary-darker-contrast': '',
  // 'accent-lighter-contrast': '',
  // 'accent-darker-contrast': '',
  // 'warn-lighter-contrast': '',
  // 'warn-darker-contrast': '',
};

------------------------ */

