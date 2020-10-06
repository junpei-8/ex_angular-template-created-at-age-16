import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { MAT_AMT_FUNCTION } from 'src/app/animations';
import { MatDialogContent, MAT_DIALOG_CONTENT } from './dialog-content-ref.service';

const dialogAmt =
  trigger('amt', [
    transition(':leave', [
      animate(`120ms ${MAT_AMT_FUNCTION.standard}` , style({ opacity: 0 }))
    ]),
    transition(':enter', [
      style({ transform: 'scale(0.8)', opacity: 0 }),
      animate(`160ms ${MAT_AMT_FUNCTION.deceleration}`, style({ transform: 'none', opacity: 1 }))
    ])
  ]);

@Component({
  selector: 'mat-dialog-lite',
  template: `
    <ng-container
      [ngComponentOutlet]='content.ref'
      [ngComponentOutletInjector]='content.injector'
    ></ng-container>
  `,
  animations: [ dialogAmt ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentDialogLiteComponent {
  @HostBinding('@amt') amt = true;

  constructor(
    @Inject(MAT_DIALOG_CONTENT) public content: MatDialogContent
  ) {}
}

@Component({
  selector: 'mat-dialog-lite',
  template: `<ng-container [ngTemplateOutlet]='content.ref'></ng-container>`,
  animations: [ dialogAmt ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDialogLiteComponent {
  @HostBinding('@amt') amt = true;

  constructor(
    @Inject(MAT_DIALOG_CONTENT) public content: MatDialogContent
  ) {
    console.log('Loaded');
  }
}
