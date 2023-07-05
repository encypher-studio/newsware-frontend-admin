import {ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../@core/services/api.service';
import {GetUserFilter, GetUserRequest} from '../../@core/models/user';
import {Pagination} from '../../@core/models/base';
import {AuthService} from '../../@core/services/auth.service';
import {NbToastrService} from '@nebular/theme';

export class NewswareDataSource extends ServerDataSource {
  constructor(
    protected http: HttpClient,
    protected apiService: ApiService,
    protected authService: AuthService,
    private toastrService: NbToastrService,
  ) {
    super(http, {endPoint: apiService.backendUrl, dataKey: 'data'});
  }

  getElements(): Promise<any> {
    const pagination = this.getPagination();
    const req: GetUserRequest = this.getFilterObject();
    if (pagination) {
      req.pagination = pagination;
    }

    return this.apiService.getUsers(req);
  }

  protected getFilterObject(): GetUserFilter {
    if (!this.filterConf.filters) return {};

    const filter = {};
    this.filterConf.filters.forEach((fieldConf: any) => {
      if (fieldConf['search']) {
        filter[fieldConf['field']] = fieldConf['search'];
      }
    });

    return filter;
  }

  protected getPagination(): Pagination {
    if (!this.pagingConf || !this.pagingConf['page']) return {page: 1, limit: 10};
    return {
      page: this.pagingConf['page'],
      limit: this.pagingConf['perPage'],
    };
  }

  add(element: any): Promise<any> {
    return Promise.resolve();
  }

  async onCreateConfirm(event) {
    if (window.confirm('Are you sure you want to create?')) {
      await this.apiService.saveUser({
        name: event.newData['name'],
        email: event.newData['email'],
      });
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  async onEditConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      await this.apiService.saveUser({
        id: event.newData['id'] ? event.newData['id'] : null,
        name: event.newData['name'],
        email: event.newData['email'],
      });
      this.replaceData(event.newData);
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  async onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      await this.apiService.deleteUser(event.data['id']);
      event.data.apikey = '';
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  async onCustomAction(event) {
    switch (event.action) {
      case 'deactivate':
        if (this.authService.user.id === event.data.id) {
          this.toastrService.danger('Can\'t deactivate yourself');
          return;
        }
        await this.apiService.deleteApikey(event.data.id);
        event.data.apikey = '';
        break;
      case 'activate':
        event.data.apikey = await this.apiService.putApikey(event.data.id);
        break;
    }
    this.replaceData(event.data);
  }

  replaceData(data) {
    for (let i = 0; i < this.data.length; i ++) {
      if (this.data[i].id === data.id) {
        this.data[i].id = data;
        break;
      }
    }
    this.load(this.data);
  }
}
