import {Component} from '@angular/core';
import {CategoryCodesDataSource} from './category-codes-data-source';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../@core/services/api.service';
import {AuthService} from "../../@core/services/auth.service";
import {NbToastrService} from "@nebular/theme";
import {Settings} from "angular2-smart-table";

@Component({
  selector: 'ngx-users',
  templateUrl: './category-codes.component.html',
  styleUrls: ['./category-codes.component.scss'],
})
export class CategoryCodesComponent {
  settings: Settings = {
    add: {
      hiddenWhen: () => true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      hiddenWhen: () => true
    },
    columns: {
      code: {
        title: 'Code',
        isEditable: false,
        isSortable: false,
        isAddable: false,
      },
      description: {
        title: 'Description',
        isEditable: true,
        isSortable: false,
        isAddable: true,
      },
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  source: CategoryCodesDataSource;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: NbToastrService,
  ) {
    this.source = new CategoryCodesDataSource(http, apiService, authService, toastrService);
  }
}
