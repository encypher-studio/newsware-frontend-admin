import { NgModule } from '@angular/core';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
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
