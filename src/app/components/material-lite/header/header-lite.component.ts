import {
  ChangeDetectionStrategy, Component, ElementRef, Inject,
  Input, OnChanges, SimpleChange, SimpleChanges,
} from '@angular/core';
import { RENDERER, RendererService } from 'src/app/services/renderer.service';
import { isThemePalette } from '../../common';

interface HeaderChanges extends SimpleChanges {
  'mat-header-lite': SimpleChange;
  color: SimpleChange;
  fixed: SimpleChange;
  size: SimpleChange;
}

type Size = 'lg' | 'md' | 'sm';

@Component({
  selector: 'header[mat-header-lite]',
  template: '<section><ng-content></ng-content></section>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderLiteComponent implements OnChanges {
  @Input() 'mat-header-lite': boolean | '';
  @Input() header: string;
  @Input() color: string;
  @Input() fixed: boolean | '';
  @Input() size: 'lg' | 'md' | 'sm';

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(RENDERER) private _renderer: RendererService,
  ) {}

  ngOnChanges(changes: HeaderChanges): void {
    const headerElement = this._elementRef.nativeElement;

    const colorChanges = changes.color;
    if (colorChanges) {
      const color = colorChanges.currentValue;
      const colorIsThemePalette = isThemePalette(colorChanges.currentValue);
      if (colorIsThemePalette) {
        this._renderer.setStyle(headerElement, 'background-color', `var(--theme-${color})`);
        this._renderer.setStyle(headerElement, 'color', `var(--theme-${color}-contrast)`);
      } else {
        this._renderer.setStyle(headerElement, 'background-color', color);
        this._renderer.removeStyle(headerElement, 'color');
      }
    }

    const sizeChanges = changes.size;
    if (sizeChanges) {
      const size = sizeChanges.currentValue as Size;
      if (size === 'sm' || size === 'lg' || size === 'md') {
        this._renderer.addClass(headerElement, 'mat-' + size + '-header-lite');
      }

      // 前回のstyleは消す
      this._renderer.removeClass(headerElement, 'mat-' + sizeChanges.previousValue + '-header-lite');
    }

    const fixedChanges = changes.fixed;
    if (fixedChanges) {
      const value = fixedChanges.currentValue;
      (value || value === '') ?
          this._renderer.addClass(headerElement, 'mat-fixed-header-wrapper')
        : this._renderer.removeClass(headerElement, 'mat-fixed-header-wrapper');
    }
  }
}
