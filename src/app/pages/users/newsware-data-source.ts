import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../@core/services/api.service';
import {GetUserFilter, GetUserRequest} from '../../@core/models/user';
import {Pagination} from '../../@core/models/base';
import {AuthService} from '../../@core/services/auth.service';
import {NbToastrService} from '@nebular/theme';
import {ServerDataSource} from "angular2-smart-table";

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
    return this.requestUsers();
  }

  async requestUsers(): Promise<any> {
    const pagination = this.getPagination();
    const req: GetUserRequest = this.getFilterObject();
    if (pagination) {
      req.pagination = pagination;
    }

    const res = await this.apiService.getUsers(req);
    this.lastRequestCount = res.totalCount;
    return res.data;
  }

  protected getFilterObject(): GetUserFilter {
    if (!this.filterConf.filters) return {};

    const filter = {};
    this.filterConf.filters.forEach((fieldConf: any) => {
      if (fieldConf['search']) {
        filter[fieldConf['field']] = fieldConf['field'] == "id" ? parseInt(fieldConf['search']) : fieldConf['search'];
      }
    });

    return filter;
  }

  protected getPagination(): Pagination {
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
      this.toastrService.success("Created");
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
      this.toastrService.success("Edited");
    } else {
      event.confirm.reject();
    }
  }

  async onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      await this.apiService.deleteUser(event.data['id']);
      event.data.apikey = '';
      event.confirm.resolve();
      this.toastrService.success("Deleted");
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
        this.toastrService.success("Deactivated");
        event.data.apikey = '';
        break;
      case 'activate':
        event.data.apikey = await this.apiService.putApikey(event.data.id);
        this.toastrService.success("Activated");
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
