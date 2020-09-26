import { InjectionToken } from '@angular/core';
import { expFactory, ExpService } from './exp';

export const LOADING_USER_EXP = new InjectionToken<ExpService>('Exp', {
  providedIn: 'root',
  factory: () => expFactory()
});
