import { Inject, Injectable, Injector, NgZone, ReflectiveInjector, ResolvedReflectiveFactory, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalOutletOutputData, ModalOutletService } from '../../modal-outlet';
import { InjectionToken } from '@angular/core';
import { ComponentType } from 'src/app/typings';
import { MatDialogContent, MAT_DIALOG_CONTENT } from './dialog-content-ref.service';
import { ComponentDialogLiteComponent, TemplateDialogLiteComponent } from './dialog-lite.component';


export const MAT_DIALOG_LITE_DATA = new InjectionToken<any>('MatDialogLiteData');

interface Config {
  data?: any;
  needDisableCloseEvents?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class MatDialogLiteService {
  opened: boolean;
  currentOutputData: ModalOutletOutputData | null;

  constructor(
    private _modalOutlet: ModalOutletService,
    private _zone: NgZone,
    private _injector: Injector,
    @Inject(MAT_DIALOG_CONTENT) private _dialogContent: MatDialogContent,
  ) { }

  open(ref: ComponentType<any> | TemplateRef<any>, config: Config = {}): void {
    if (this.opened) { return; }
    this.opened = true;
    this._dialogContent.ref = ref;

    this._dialogContent.injector = ReflectiveInjector.resolveAndCreate(
      [{ provide: MAT_DIALOG_LITE_DATA, useValue: config.data }], this._injector);

    let outputData: ModalOutletOutputData;

    if (ref instanceof TemplateRef) {
      outputData = this._modalOutlet.output(TemplateDialogLiteComponent, {
        needUseOverlay: true
      });
    } else if (typeof ref === 'function') {
      outputData = this._modalOutlet.output(ComponentDialogLiteComponent, {
        needUseOverlay: true
      });

    } else { throw new Error(''); }

    this.currentOutputData = outputData;

    if (!config.needDisableCloseEvents) {
      outputData.keydownEvents()
        .subscribe(keyEvent => {
          console.log(keyEvent);
          if (keyEvent.key === 'esc' || keyEvent.key === 'Backspace') {
            this.close('any');
          }
        });

      outputData.backdropClick()
        .subscribe(() => this.close('any'));
    }
  }

  close(outputData: ModalOutletOutputData | 'any'): void {
    if (!this.opened) { return; }
    this.opened = false;

    if (outputData === 'any') {
      // @ts-ignore
      this._modalOutlet.close(this.currentOutputData);
    } else {
      if (outputData !== this.currentOutputData) { return; }
      this._modalOutlet.close(outputData);
    }

    this.currentOutputData = null;

    this._zone.runOutsideAngular(() => setTimeout(() => {
      this._dialogContent.ref = null;
      this._dialogContent.injector = null;
    }, 120));
  }

}
