import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {GetUserRequest, SaveUserRequest, User} from '../models/user';
import {Injectable} from '@angular/core';
import {CategoryCode, PutCategoryCodeRequest} from "../models/category-code";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public backendUrl: string;
  restEndpoint: string
  apikey: string = '';

  constructor(protected http: HttpClient) {
    this.backendUrl = environment.backendUrl;
    this.restEndpoint = environment.backendUrl + "/api/v3"
  }

  async getCategoryCodes(): Promise<ApiResult<CategoryCode[]>> {
    return await this.get<CategoryCode[]>('/category-codes');
  }

  async putCategoryCode(req: PutCategoryCodeRequest) {
    await this.put('/category-codes', req);
  }

  async getUsers(req: GetUserRequest): Promise<ApiResult<User[]>> {
    return await this.get<User[]>('/admin/users', {
      filter: req,
    });
  }

  async saveUser(req: SaveUserRequest) {
    await this.put('/admin/user', req);
  }

  async deleteUser(userId: number) {
    await this.delete('/admin/user', {
      userId,
    });
  }

  async deleteApikey(userId: number) {
    await this.delete('/admin/apikey', {
      userId,
    });
  }

  async putApikey(userId: number): Promise<string> {
    return await this.put<string>('/admin/apikey', {userId});
  }

  async getUserByApiKey(apikey: number): Promise<User> {
    return (await this.get<User>('/user/apikey', {apikey}, false)).data;
  }

  async get<T>(relativeUrl: string, params?: object, stringifyParams: boolean = true): Promise<ApiResult<T>> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, stringifyParams ? JSON.stringify(params[key]) : params[key]);
      }
    }


    return this.handleSuccess<T>(
      await this.http.get(`${this.restEndpoint}${relativeUrl}`, {
        params: httpParams,
        headers: {
          'x-api-key': this.apikey,
        },
        observe: 'response',
      }).toPromise().catch(this.handleError),
    );
  }

  async put<T>(relativeUrl: string, body?: object): Promise<T> {
    return this.handleSuccess<T>(
      await this.http.put(`${this.restEndpoint}${relativeUrl}`, body, {
        headers: {
          'x-api-key': this.apikey,
        },
        observe: 'response',
      }).toPromise().catch(this.handleError),
    ).data;
  }

  async delete(relativeUrl: string, params?: object) {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, JSON.stringify(params[key]));
      }
    }
    return this.handleSuccess(
      await this.http.delete(`${this.restEndpoint}${relativeUrl}`, {
        params: httpParams,
        headers: {
          'x-api-key': this.apikey,
        },
        observe: 'response',
      }).toPromise().catch(this.handleError),
    );
  }

  handleSuccess<T>(response: HttpResponse<Object>): ApiResult<T> {
    return {
      data: response.body['data'],
      totalCount: parseInt(response.headers.get('X-TOTAL-COUNT'), 10),
    };
  }

  handleError(response: HttpErrorResponse): HttpResponse<Object> {
    const errorMessage = response.error.error.message;
    throw Error(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
  }
}

export interface ApiResult<T> {
  data: T;
  totalCount?: number;
}
