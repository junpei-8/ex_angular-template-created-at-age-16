import { NgModule } from '@angular/core';

import { ButtonLiteComponent } from './button-lite.component';
import { MatRippleLiteModule } from '../ripple';

@NgModule({
  declarations: [ ButtonLiteComponent ],
  exports: [ ButtonLiteComponent ],
  imports: [ MatRippleLiteModule ]
})
export class MatButtonLiteModule { }
