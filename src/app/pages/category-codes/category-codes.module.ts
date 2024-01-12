import {NgModule} from '@angular/core';
import {NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule} from '@nebular/theme';
import {ThemeModule} from '../../@theme/theme.module';
import {CategoryCodesComponent} from './category-codes.component';
import {Angular2SmartTableModule} from "angular2-smart-table";

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Angular2SmartTableModule,
  ],
  declarations: [
    CategoryCodesComponent,
  ],
})
export class CategoryCodesModule { }
