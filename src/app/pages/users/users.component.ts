import {Component} from '@angular/core';
import {NewswareDataSource} from './newsware-data-source';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../@core/services/api.service';
import {AuthService} from "../../@core/services/auth.service";
import {NbToastrService} from "@nebular/theme";
import {Settings} from "angular2-smart-table";

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  settings: Settings = {
    actions: {
      custom: [
        {
          name: 'activate',
          title: '<span class="custom-action activate-icon">Activate</span>',
        },
        {
          name: 'deactivate',
          title: '<span class="custom-action deactivate-icon">Deactivate</span>',
        },
      ],
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        isEditable: false,
        isSortable: false,
        isAddable: false,
      },
      name: {
        title: 'Name',
        isEditable: true,
        isSortable: false,
        isAddable: true,
      },
      email: {
        title: 'E-mail',
        isEditable: true,
        isSortable: false,
        isAddable: true,
      },
      apikey: {
        title: 'Apikey',
        filter: false,
        isEditable: false,
        isSortable: false,
        isAddable: false,
      },
    },
    rowClassFunction: (row) => {
      if (!row.data.apikey) {
        return 'activate';
      } else {
        return 'deactivate';
      }
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  source: NewswareDataSource;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: NbToastrService,
  ) {
    this.source = new NewswareDataSource(http, apiService, authService, toastrService);
  }
}
