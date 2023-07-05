import { Component } from '@angular/core';
import {NewswareDataSource} from './newsware-data-source';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../@core/services/api.service';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  settings = {
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
        type: 'number',
        editable: false,
        sort: false,
        addable: false,
      },
      name: {
        title: 'Name',
        type: 'string',
        sort: false,
      },
      email: {
        title: 'E-mail',
        type: 'string',
        sort: false,
      },
      apikey: {
        title: 'Apikey',
        type: 'string',
        editable: false,
        sort: false,
        filter: false,
        addable: false,
      },
    },
    rowClassFunction: (row) => {
      if (!row.data.apikey) {
        return 'activate';
      } else {
        return 'deactivate';
      }
    },
  };

  source: NewswareDataSource;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
  ) {
    this.source = new NewswareDataSource(http, apiService);
  }
}
