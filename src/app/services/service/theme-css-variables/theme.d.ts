export declare type ThemeBaseTypes = ['light', 'dark'];


// 変更する際はここを変更する
export declare type ThemeTypes = ['light', 'dark'];
export declare type ThemePaletteTypes = ['primary', 'accent', 'warn'];
export declare type ThemePaletteContrastTypes = ['primary-contrast', 'accent-contrast', 'warn-contrast'];

// Union型へ変換
export declare type ThemeBaseType = ThemeBaseTypes[number];
export declare type ThemeType = ThemeTypes[number];
export declare type ThemePaletteType = ThemePaletteTypes[number];
export declare type ThemePaletteContrastType = ThemePaletteContrastTypes[number];


// その他
export declare type ThemeTextContrastColor = '#fff' | 'rgba(0,0,0,.87)';
