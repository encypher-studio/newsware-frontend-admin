import {ServerDataSource} from 'ng2-smart-table';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerSourceConf} from 'ng2-smart-table/lib/lib/data-source/server/server-source.conf';
import {Observable} from 'rxjs';

export class NewswareDataSource extends ServerDataSource {
  constructor(protected http: HttpClient, private apiKey: string, conf: ServerSourceConf | {} = {}) {
    conf = {
      ... conf,
      dataKey: 'data',
    };
    super(http, conf);
  }

  protected requestElements(): Observable<any> {
    const httpParams = this.createRequestParams();
    return this.http.get(this.conf.endPoint, {
      params: httpParams,
      headers: {
        'x-api-key': this.apiKey,
      },
      observe: 'response',
    });
  }

  protected createRequestParams(): HttpParams {
    const pagination = this.getPaginationObject();
    const filter = this.getFilterObject();
    if (pagination) {
      filter['pagination'] = pagination;
    }
    return new HttpParams().set('filter', JSON.stringify(filter));
  }

  protected getFilterObject(): object {
    if (!this.filterConf.filters) return {};

    const filter = {};
    this.filterConf.filters.forEach((fieldConf: any) => {
      if (fieldConf['search']) {
        filter[fieldConf['field']] = fieldConf['search'];
      }
    });

    return filter;
  }

  protected getPaginationObject(): object {
    if (!this.pagingConf || !this.pagingConf['page']) return {page: 1, limit: 10};
    return {
      page: this.pagingConf['page'],
      limit: this.pagingConf['perPage'],
    };
  }
}
