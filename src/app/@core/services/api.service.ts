import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {GetUserRequest, SaveUserRequest} from '../models/user';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public backendUrl: string;
  apikey: string = '';

  constructor(protected http: HttpClient) {
    this.backendUrl = environment.backendUrl;
  }

  async getUsers(req: GetUserRequest) {
    return await this.get('/v1/api/admin/users', {
      filter: req,
    });
  }

  async saveUser(req: SaveUserRequest) {
    await this.put('/v1/api/admin/user', req);
  }

  async deleteUser(userId: number) {
    await this.delete('/v1/api/admin/user', {
      userId,
    });
  }

  async deleteApikey(userId: number) {
    await this.delete('/v1/api/admin/apikey', {
      userId,
    });
  }

  async putApikey(userId: number): Promise<string> {
    return await this.put<string>('/v1/api/admin/apikey', {userId});
  }

  async getUserByApiKey(apikey: number) {
    return await this.get('/v1/api/user/apikey', {apikey}, false);
  }

  async get<T>(relativeUrl: string, params?: object, stringifyParams: boolean = true): Promise<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, stringifyParams ? JSON.stringify(params[key]) : params[key]);
      }
    }


    return this.handleSuccess(
      await this.http.get(`${this.backendUrl}${relativeUrl}`, {
        params: httpParams,
        headers: {
          'x-api-key': this.apikey,
        },
        observe: 'response',
      }).toPromise().catch(this.handleError),
    );
  }

  async put<T>(relativeUrl: string, body?: object): Promise<T> {
    return this.handleSuccess(
      await this.http.put(`${this.backendUrl}${relativeUrl}`, body, {
        headers: {
          'x-api-key': this.apikey,
        },
        observe: 'response',
      }).toPromise().catch(this.handleError),
    );
  }

  async delete(relativeUrl: string, params?: object) {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, JSON.stringify(params[key]));
      }
    }
    return this.handleSuccess(
      await this.http.delete(`${this.backendUrl}${relativeUrl}`, {
        params: httpParams,
        headers: {
          'x-api-key': this.apikey,
        },
        observe: 'response',
      }).toPromise().catch(this.handleError),
    );
  }

  handleSuccess<T>(response: HttpResponse<Object>): T {
      return response.body['data'];
  }

  handleError(response: HttpErrorResponse): HttpResponse<Object> {
    const errorMessage = response.error.error.message;
    throw Error(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
  }
}
