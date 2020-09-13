import { NgModule } from '@angular/core';
import { AppRoutes } from './app-routing';
import { RouterModule } from '@angular/router';

const routes: AppRoutes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
