import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {GetUserRequest, SaveUserRequest} from '../models/user';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public apiKey: string = '568f5d4d-d6ad-4250-b187-2d6179f05786';
  public backendUrl: string;

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

  async putApikey(userId: number) {
    return await this.put('/v1/api/admin/apikey', {userId});
  }

  get(relativeUrl: string, params?: object) {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, JSON.stringify(params[key]));
      }
    }
    return this.http.get(`${this.backendUrl}${relativeUrl}`, {
      params: httpParams,
      headers: {
        'x-api-key': this.apiKey,
      },
      observe: 'response',
    }).toPromise();
  }

  put(relativeUrl: string, body?: object) {
    return this.http.put(`${this.backendUrl}${relativeUrl}`, body, {
      headers: {
        'x-api-key': this.apiKey,
      },
      observe: 'response',
    }).toPromise();
  }

  delete(relativeUrl: string, params?: object) {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, JSON.stringify(params[key]));
      }
    }
    return this.http.delete(`${this.backendUrl}${relativeUrl}`, {
      params: httpParams,
      headers: {
        'x-api-key': this.apiKey,
      },
      observe: 'response',
    }).toPromise();
  }
}
