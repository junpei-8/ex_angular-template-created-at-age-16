import { NgModule } from '@angular/core';
import { MatButtonLiteModule } from 'src/app/components/material-lite/button';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    MatButtonLiteModule
  ]
})
export class HomeModule { }
