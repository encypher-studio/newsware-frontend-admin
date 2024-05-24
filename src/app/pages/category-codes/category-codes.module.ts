import { NgModule } from '@angular/core';
import { NbAccordionModule, NbCardModule, NbIconModule, NbInputModule, NbListModule, NbTreeGridModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { CategoryCodesComponent } from './category-codes.component';
import { Angular2SmartTableModule } from "angular2-smart-table";
import { SourceCategoryCodesComponent } from './source-category-codes/source-category-codes.component';
import { GroupCategoryCodesComponent } from './group-category-codes/group-category-codes.component';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Angular2SmartTableModule,
    NbAccordionModule
  ],
  declarations: [
    CategoryCodesComponent,
    SourceCategoryCodesComponent,
    GroupCategoryCodesComponent
  ],
})
export class CategoryCodesModule { }
