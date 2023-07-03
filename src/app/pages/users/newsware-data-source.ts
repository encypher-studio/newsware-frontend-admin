import {ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {ApiService} from '../../@core/services/api.service';
import {GetUserFilter, GetUserRequest} from '../../@core/models/user';
import {Pagination} from '../../@core/models/base';

export class NewswareDataSource extends ServerDataSource {
  constructor(
    protected http: HttpClient,
    protected apiService: ApiService,
  ) {
    super(http, {endPoint: apiService.backendUrl, dataKey: 'data'});
  }

  protected requestElements(): Observable<any> {
    const pagination = this.getPagination();
    const req: GetUserRequest = this.getFilterObject();
    if (pagination) {
      req.pagination = pagination;
    }

    return from(this.apiService.getUsers(req));
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
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  async onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      await this.apiService.deleteUser(event.data['id']);
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
