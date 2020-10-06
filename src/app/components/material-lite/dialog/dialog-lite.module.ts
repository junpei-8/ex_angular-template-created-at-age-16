import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentDialogLiteComponent } from './dialog-lite.component';
import { TemplateDialogLiteComponent } from './dialog-lite.component';

@NgModule({
  declarations: [
    ComponentDialogLiteComponent,
    TemplateDialogLiteComponent
  ],
  exports: [
    ComponentDialogLiteComponent,
    TemplateDialogLiteComponent
  ],
  imports: [
    CommonModule
  ],
})
export class MatDialogLiteModule {}
