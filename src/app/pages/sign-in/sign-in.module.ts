import {NgModule} from '@angular/core';
import {NbButtonModule, NbCardModule, NbInputModule} from '@nebular/theme';

import {ThemeModule} from '../../@theme/theme.module';
import {SignInComponent} from './sign-in.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    ThemeModule,
    FormsModule,
  ],
  declarations: [
    SignInComponent,
  ],
})
export class SignInModule { }
