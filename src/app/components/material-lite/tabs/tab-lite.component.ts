import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'mat-tab-lite',
  template: '<ng-template><ng-content></ng-content></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabLiteComponent {
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  @Input() label: string;
  index: number;
}
