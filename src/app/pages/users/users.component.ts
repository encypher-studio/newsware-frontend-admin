import { Component } from '@angular/core';
import {LocalDataSource, ServerDataSource} from 'ng2-smart-table';
import {SmartTableData} from '../../@core/data/smart-table';
import {environment} from '../../../environments/environment';
import {NewswareDataSource} from './newsware-data-source';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      apikey: {
        title: 'Apikey',
        type: 'string',
      },
    },
  };

  source: ServerDataSource;

  constructor(private service: SmartTableData, private http: HttpClient) {
    this.source = new NewswareDataSource(http, '568f5d4d-d6ad-4250-b187-2d6179f05786', {
      endPoint: environment.backendUrl + '/v1/api/admin/users',
      filterFieldKey: '',
    });
    const data = this.service.getData();
    this.source.load(data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
