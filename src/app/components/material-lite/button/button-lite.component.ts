import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnChanges, SimpleChange } from '@angular/core';
import { RENDERER, RendererService } from 'src/app/services/renderer.service';
import { isThemePalette } from '../../common';

type Binders = [
  'mat-button-lite',
  'variant',
  'color',
  'contrast',
  'disabled',
  'disableRipple'
];
type ButtonLiteChanges = {
  [key in Binders[number]]: SimpleChange;
};
type Variant = 'basic' | 'raised' | 'stroked' | 'flat' | 'fab' | 'icon';

@Component({
  selector: 'button[mat-button-lite]',
  templateUrl: './button-lite.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonLiteComponent implements OnChanges {
  @Input() 'mat-button-lite': undefined;
  @Input() variant: Variant = 'basic';

  @Input() color: string;
  @Input() contrast: string;

  @Input() disabled: boolean;
  @Input() disableRipple: boolean;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(RENDERER) private _renderer: RendererService,
  ) { _renderer.addClass(_elementRef.nativeElement, 'mat-button-lite'); }

  ngOnChanges(changes: ButtonLiteChanges): void {
    const isFirst = changes['mat-button-lite'];
    const hostElement = this._elementRef.nativeElement;

    const variantChanges = changes.variant;
    if (variantChanges) {
      this._renderer.removeClass(this._elementRef.nativeElement, `mat-${variantChanges.previousValue || 'basic'}-button-lite`);
      this._renderer.addClass(this._elementRef.nativeElement, `mat-${variantChanges.currentValue || 'basic'}-button-lite`);
    } else if (isFirst) {
      this._renderer.addClass(this._elementRef.nativeElement, `mat-basic-button-lite`);
    }

    const colorChanges = changes.color;
    if (colorChanges || variantChanges) {
      const color = this.color;

      if (!color || color === 'default') {
        this._setDefaultColor('ADD');
      } else {
        this._setDefaultColor('REMOVE');

        const styleName = '--mbl-color';
        if (isThemePalette(color)) {
          this._renderer.setStyle(hostElement, styleName, `var(--theme-${color})`, 2);
        } else {
          this._renderer.setStyle(hostElement, styleName, color);
        }
      }
    }

    if (isFirst && !variantChanges && !colorChanges) {
      this._setDefaultColor('ADD');
    }

    const contrastChanges = changes.contrast;
    if (contrastChanges || colorChanges) {
      const styleName = '--mbl-contrast';

      // contrast binder の方を、style反映を優先
      if (this.contrast) {
        this._renderer.setStyle(hostElement, styleName, this.contrast, 2);
      } else {
        if (isThemePalette(this.color)) {
          this._renderer.setStyle(hostElement, styleName, `var(--theme-${this.color}-contrast)`, 2);
        } else {
          this._renderer.setStyle(hostElement, styleName, `var(--theme-text)`, 2);
        }
      }
    }

    const disabledChanges = changes.disabled;
    if (disabledChanges) {
      const className = 'mat-disabled-button-lite';
      const isDisabled = disabledChanges.currentValue;
      (isDisabled || isDisabled === '') ?
          this._renderer.addClass(hostElement, className)
        : this._renderer.removeClass(hostElement, className);
    }

    const disableRippleChanges = changes.disableRipple;
    if (disableRippleChanges) {
      const className = 'mat-disable-ripple-button-lite';
      const isDisabled = disableRippleChanges.currentValue;
      (isDisabled || isDisabled === '') ?
          this._renderer.addClass(hostElement, className)
        : this._renderer.removeClass(hostElement, className);
    }
  }

  private _setDefaultColor(actionType: 'ADD' | 'REMOVE'): void {
    if (actionType === 'ADD') {
      // Add action
      if (!this.variant || this.variant === 'basic' || this.variant === 'stroked' || this.variant === 'icon') {
        this._renderer.removeClass(this._elementRef.nativeElement, 'mat-button-lite-default-color-type2');
        this._renderer.addClass(this._elementRef.nativeElement, 'mat-button-lite-default-color-type1');
      } else {
        this._renderer.removeClass(this._elementRef.nativeElement, 'mat-button-lite-default-color-type1');
        this._renderer.addClass(this._elementRef.nativeElement, 'mat-button-lite-default-color-type2');
      }
    } else {
      // Remove action
      this._renderer.removeClass(this._elementRef.nativeElement, 'mat-button-lite-default-color-type1');
      this._renderer.removeClass(this._elementRef.nativeElement, 'mat-button-lite-default-color-type2');
    }
  }
}

