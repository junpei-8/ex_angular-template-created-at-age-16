import { NgModule } from '@angular/core';
import { AppRoutes } from './app-routing';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: AppRoutes = [
  {
    path: 'home', data: { title: 'Home', key: ['Home'] },
    loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**', data: { title: 'Not Found', key: ['NotFound'] },
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollOffset: [0, 32]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
