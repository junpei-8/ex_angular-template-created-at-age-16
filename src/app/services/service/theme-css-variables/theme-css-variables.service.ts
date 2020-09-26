import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { ThemeType } from '../../../typings';
import { RENDERER, RendererService } from '../../renderer.service';
import { MIN_THEME_CSS_VARIABLE, DARK_THEME_CSS_VARIABLE, LIGHT_THEME_CSS_VARIABLE, ThemeCssVariable } from './theme-css-variables.const';


@Injectable({
  providedIn: 'root'
})
export class ThemeCssVariablesService {
  private _styleElement: HTMLElement;

  constructor(
    private _zone: NgZone,
    @Inject(DOCUMENT) _document: Document,
    @Inject(RENDERER) private _renderer: RendererService,
  ) {
    const styleElement = this._renderer.createElement('style');
    const styleContent = this._renderer.createText(convertToCssVariablesString(MIN_THEME_CSS_VARIABLE));

    // elementにcontentを埋め込み、それらの参照をclass内変数へ代入
    this._renderer.appendChild(styleElement, styleContent);
    this._styleElement = styleElement;

    // 作成したelementをhead内に挿入
    this._renderer.appendChild(_document.head, styleElement);
  }

  private _replaceStyleElementContent(cssVariablesString: string): void {
    // 新しいコンテンツを作成して挿入
    this._renderer.appendChild(this._styleElement, this._renderer.createText(cssVariablesString));

    // 古いコンテンツを削除
    this._renderer.removeChild(this._styleElement, this._styleElement.firstChild);
  }

  set(
    themeCssVariable: ThemeType | ThemeCssVariable,
    config: { worker?: boolean; reflectDelay?: number } = {}
  ): void { this._zone.runOutsideAngular(() => { // <= change detection 防止
    const needUseWorker = config.worker === false ? false : true;
    const reflectDelay = config.reflectDelay;

    if (needUseWorker && typeof Worker !== 'undefined') {
      const worker = new Worker('./theme-css-variables.worker.ts', {type: 'module'});

      worker.onmessage = (reflectDelay) ?
        ({ data }) => setTimeout(() => this._replaceStyleElementContent(data), reflectDelay)
      : ({ data }) => this._replaceStyleElementContent(data);

      worker.postMessage(
        (themeCssVariable === 'dark') ? DARK_THEME_CSS_VARIABLE :
        (themeCssVariable === 'light') ? LIGHT_THEME_CSS_VARIABLE :
        themeCssVariable
      );

    } else {
      const data =
        (themeCssVariable === 'dark') ? DARK_THEME_CSS_VARIABLE :
        (themeCssVariable === 'light') ? LIGHT_THEME_CSS_VARIABLE :
        themeCssVariable;

      const cssVariableString = convertToCssVariablesString(data);

      (reflectDelay) ?
        setTimeout(() => this._replaceStyleElementContent(cssVariableString), reflectDelay)
      : this._replaceStyleElementContent(cssVariableString);
    }
  }); }
}

function convertToCssVariablesString(object: { [key: string]: string }): string {
  const keys = Object.keys(object);
  const keyLength = keys.length;

  let result = ':root{';
  for (let i = 0; i < keyLength; i = (i + 1) | 0) {
    const key = keys[i];
    result += ('--theme-' + key + ':' + object[key] + ';');
  }
  return result += '}';
}
