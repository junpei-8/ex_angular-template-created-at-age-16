import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mat-icon-lite',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconLiteComponent implements OnInit {
  @HostBinding() style = '';
  @Input('size') set setSize(size: number) {
    this.style = '--mat-icon-lite-size:' + size + 'px';
  }

  ngOnInit(): void {
    if (!this.style) {
      this.style = '--mat-icon-lite-size:24px';
    }
  }
}
