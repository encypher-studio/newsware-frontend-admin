import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import {UsersComponent} from './users/users.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {LoginActivateGuard} from '../@core/guards/login-activate.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'users',
      component: UsersComponent,
      canActivate: [LoginActivateGuard],
    },
    {
      path: 'sign-in',
      component: SignInComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
