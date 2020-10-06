import { InjectionToken, Injector, TemplateRef } from '@angular/core';
import { ComponentType } from '../../../typings';

export type MatDialogContent = {
  ref: ComponentType<any> | TemplateRef<any> | null;
  injector: Injector | null;
};

export const MAT_DIALOG_CONTENT = new InjectionToken<MatDialogContent>('', {
  providedIn: 'root',
  factory: () => ({
    ref: null,
    injector: null
  })
});
