import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../@core/services/api.service';
import { AuthService } from '../../../@core/services/auth.service';
import { NbToastrService } from '@nebular/theme';
import { ServerDataSource } from "angular2-smart-table";
import { CategoryCode } from "../../../@core/models/category-code";

export class CategoryCodesDataSource extends ServerDataSource {
  categoryCodes: CategoryCode[]

  constructor(
    protected http: HttpClient,
    protected apiService: ApiService,
    protected authService: AuthService,
    private toastrService: NbToastrService,
    private source: string
  ) {
    super(http, { endPoint: apiService.backendUrl, dataKey: 'data' });
  }

  getElements(): Promise<any> {
    return this.requestCategoryCodes();
  }

  async requestCategoryCodes(): Promise<any> {
    if (!this.categoryCodes) {
      const res = await this.apiService.getCategoryCodes(this.source);
      this.categoryCodes = res.data
      this.lastRequestCount = res.totalCount;
    }

    const codeFilter = this.filterConf.filters.find(fc => fc.field == "code")
    const descriptionFilter = this.filterConf.filters.find(fc => fc.field == "description")
    const sourceFilter = this.filterConf.filters.find(fc => fc.field == "source")


    return this.categoryCodes.filter((c) => {
      let shouldRet = true
      if (codeFilter?.search) {
        shouldRet = c.code.toLowerCase().includes(codeFilter.search.toLowerCase())
      }
      if (descriptionFilter?.search) {
        shouldRet = c.description.toLowerCase().includes(descriptionFilter.search.toLowerCase())
      }
      if (sourceFilter?.search) {
        shouldRet = c.source.toLowerCase().includes(sourceFilter.search.toLowerCase())
      }
      return shouldRet
    });
  }

  add(element: any): Promise<any> {
    return Promise.resolve();
  }

  async onEditConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      await this.apiService.putCategoryCode({
        code: event.newData['code'],
        description: event.newData['description'],
      });
      this.replaceData(event.newData);
      this.toastrService.success("Edited");
    } else {
      event.confirm.reject();
    }
  }

  replaceData(data) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id === data.id) {
        this.data[i].id = data;
        break;
      }
    }
    this.load(this.data);
  }
}
