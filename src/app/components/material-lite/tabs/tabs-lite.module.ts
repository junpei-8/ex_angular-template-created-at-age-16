import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatRippleLiteModule } from '../ripple';
import { TabGroupLiteComponent } from './tab-group-lite.component';
import { TabLiteComponent } from './tab-lite.component';

@NgModule({
  declarations: [ TabGroupLiteComponent, TabLiteComponent ],
  exports: [ TabGroupLiteComponent, TabLiteComponent ],
  imports: [ MatRippleLiteModule, CommonModule ]
})
export class MatTabsLiteModule { }
