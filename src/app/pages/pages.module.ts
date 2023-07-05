import {NgModule} from '@angular/core';
import {NbMenuModule} from '@nebular/theme';

import {ThemeModule} from '../@theme/theme.module';
import {PagesComponent} from './pages.component';
import {PagesRoutingModule} from './pages-routing.module';
import {UsersModule} from './users/users.module';
import {SignInModule} from './sign-in/sign-in.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    UsersModule,
    SignInModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
