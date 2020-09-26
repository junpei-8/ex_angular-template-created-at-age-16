import { Directive, ElementRef, Inject, Input, NgZone, OnDestroy } from '@angular/core';
import { RendererService, RENDERER } from '../../../services/renderer.service';
import { isThemePalette } from '../../common';

@Directive({
  selector: '[mat-ripple-lite], [matRippleLite]'
})
export class RippleLiteDirective implements OnDestroy {
  @Input('matRippleColor') set setColor(color: string) {
    this._color = (isThemePalette(color)) ?
        `var(--theme-${color})`
      : color;
  }
  private _color: string;

  @Input('matRippleAmtTiming') set setAmtTiming(timing: {enter: number; leave: number} | {enter: number} | {leave: number}) {
    // @ts-ignore
    if (timing.enter) { this._amtTiming.enter = timing.enter; }
    // @ts-ignore
    if (timing.leave) { this._amtTiming.leave = timing.leave; }
  }
  private _amtTiming: {enter: number; leave: number} = {
    enter: 448, leave: 400
  };

  @Input() matRippleOpacity: number;
  @Input() matRippleDisabled: boolean;

  @Input() matRippleCentered: boolean;

  private _pointerdownHandler: () => void;

  private _containerRect: ClientRect | null;
  private _existingRippleLength: number = 0;

  constructor(
    _elementRef: ElementRef<HTMLElement>,
    zone: NgZone,
    @Inject(RENDERER) private _renderer: RendererService,
  ) {
    _renderer.addClass(_elementRef.nativeElement, 'mat-ripple-lite-container');

    zone.runOutsideAngular(() => {

    const containerElement = _elementRef.nativeElement;

    this._pointerdownHandler = this._renderer.listen(containerElement, 'pointerdown', (pde) => {
      if (this.matRippleDisabled) { return; }
      const containerRect: ClientRect = this._containerRect =
        this._containerRect || containerElement.getBoundingClientRect();

      let x: number;
      let y: number;

      if (this.matRippleCentered) {
        x = containerRect.left + containerRect.width / 2;
        y = containerRect.top + containerRect.height / 2;
      } else {
        x = pde.clientX;
        y = pde.clientY;
      }

      const distance = distanceToFurthestCorner(x, y, containerRect);
      const size = distance * 2;

      const ripple: HTMLElement = this._renderer.createElement('div');
      const rippleStyles: string =
        'left:' + (x - containerRect .left - distance) + 'px;' +
        'top:' + (y - containerRect.top - distance) + 'px;' +
        'width:' + size + 'px;' + 'height:' + size + 'px;' +
        'background-color:' + (this._color || 'var(--theme-opposite-base)') + ';' +
        'transition-duration:' + this._amtTiming.enter + 'ms;' +
        'opacity:' + (this.matRippleOpacity || 0.12);

      this._renderer.addClass(ripple, 'mat-ripple-lite-element');
      this._renderer.setAttribute(ripple, 'style', rippleStyles);

      this._renderer.appendChild(containerElement, ripple);
      this._existingRippleLength = (this._existingRippleLength + 1) | 0;

      // 非同期として扱わないとうまくアニメーションが起きない
      setTimeout(() => this._renderer.setStyle(ripple, 'transform', 'scale(1)'));

      let listenerEventHasFired: boolean;
      let rippleHasEntered: boolean;

      setTimeout(() => {
        // listenerEventが既に発火されていた場合、fadeOutRipple()を呼び出す
        // されていなかったら、"rippleHasEntered"をtrueにすることで、ripple削除の処理は、eventListenerの方に任せている
        (listenerEventHasFired) ?
            this._fadeOutRipple(ripple, containerElement)
          : rippleHasEntered = true;
      }, this._amtTiming.enter);

      const pointerupHandler: () => void = this._renderer.listen(containerElement, 'pointerup', () => handlerEvent());
      const pointerleaveHandler: () => void = this._renderer.listen(containerElement, 'pointerleave', () => handlerEvent());

      const handlerEvent = () => {
        // Remove handlers
        pointerupHandler();
        pointerleaveHandler();

        // rippleが完全にenterされていた場合、fadeOutRipple()を呼び出す
        // されていなかったら、"listenerEventHasFired"をtrueにすることで、ripple削除の処理は、setTimeoutに任せている (つまり、entryされたらすぐにrippleを削除する処理に入る)
        (rippleHasEntered) ?
            this._fadeOutRipple(ripple, containerElement)
          : listenerEventHasFired = true;
      };
    });
    });
  }

  private _fadeOutRipple(rippleElement: HTMLElement, containerElement: HTMLElement): void {
    const leaveTiming = this._amtTiming.leave;

    this._renderer.setStyle(rippleElement, 'transform-duration', leaveTiming);
    this._renderer.setStyle(rippleElement, 'opacity', '0');

    setTimeout(() => {
      containerElement.removeChild(rippleElement);
      // this._renderer.removeChild(containerElement, rippleElement);

      this._existingRippleLength = (this._existingRippleLength - 1) | 0;
      if (!this._existingRippleLength) {
        this._containerRect = null;
      }
    }, leaveTiming);
  }

  ngOnDestroy(): void {
    this._pointerdownHandler();
  }
}

function distanceToFurthestCorner(x: number, y: number, rect: ClientRect): number {
  const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
  const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
  return Math.sqrt(distX * distX + distY * distY);
}
