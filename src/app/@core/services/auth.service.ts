import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: unknown;
  constructor(private apiService: ApiService) {
  }

  async signIn(apiKey) {
    this.user = await this.apiService.getUserByApiKey(apiKey);
    this.apiService.apikey = apiKey;
  }

  isSignedIn() {
    return !!this.apiService.apikey;
  }
}
