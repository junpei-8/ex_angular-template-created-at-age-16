import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { ModalOutletComponent } from './components/modal-outlet';

import { MatHeaderLiteModule } from './components/material-lite/header';
import { MatButtonLiteModule } from './components/material-lite/button';
import { MatIconLiteModule } from './components/material-lite/icon';
import { MatDialogLiteModule } from './components/material-lite/dialog';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ModalOutletComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    MatHeaderLiteModule,
    MatIconLiteModule,
    MatButtonLiteModule,
    MatDialogLiteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
