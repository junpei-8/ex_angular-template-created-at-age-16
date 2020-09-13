export declare type ThemeBaseTypes = ['light', 'dark'];

// 変更する際はここを変更する
export declare type ThemeTypes = ['light', 'dark'];
export declare type ThemePaletteTypes = ['primary', 'accent', 'warn'];
export declare type ThemeContrastTypes = ['default', 'lighter', 'darker'];


export declare type ThemeBaseType = ThemeBaseTypes[number];
export declare type ThemeType = ThemeTypes[number];
export declare type ThemePaletteType = ThemePaletteTypes[number];
export declare type ThemeContrastType = ThemeContrastTypes[number];
export declare type ThemeTextContrastColor = '#fff' | 'rgba(0, 0, 0, 0.87)';


export declare type Theme = {
  [theme in ThemeType]: ThemePalette
}
export declare type ThemePalette = {
  [palette in ThemePaletteType]: ThemeContrast;
}

export declare type ThemeContrast = {
  [contrast in ThemeContrastType]: string;
} & {
  text: {
    [contrast in ThemeContrastType]: ThemeTextContrastColor;
  }
}

export declare type MinTheme = {
  [palette in ThemePaletteType]: string;
}

/**
 * @example
 * {
 *  light: {
 *    primary: {
 *      default: string;
 *      lighter: string;
 *      darker:  string;
 *      text: {
 *        default: '#fff' | 'rgba(0, 0, 0, 0.87)';
 *        lighter: '#fff' | 'rgba(0, 0, 0, 0.87)';
 *        darker:  '#fff' | 'rgba(0, 0, 0, 0.87)';
 *      }
 *    },
 *    accent: { ... }
 *    warn:   { ... }
 *  }
 *  dark: { ... }
 * }
 */
