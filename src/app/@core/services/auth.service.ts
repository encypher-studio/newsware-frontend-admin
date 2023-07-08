import {EventEmitter, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {RoleId, User} from '../models/user';
import {BehaviorSubject, Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  changedAuthStateEvent = new Subject();
  user: User;

  constructor(private apiService: ApiService, private router: Router) {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      this.apiService.apikey = this.user.apikey;
    }
  }

  async signIn(apiKey) {
    this.user = await this.apiService.getUserByApiKey(apiKey);
    if (!this.isAdmin()) {
      throw Error('Only admins can sign in');
    }
    this.apiService.apikey = apiKey;
    localStorage.setItem('user', JSON.stringify(this.user));
    this.changedAuthStateEvent.next(null);
    await this.router.navigate(['/users']);
  }

  isSignedIn() {
    return !!this.apiService.apikey;
  }

  async signOut() {
    localStorage.removeItem('user');
    this.apiService.apikey = '';
    this.changedAuthStateEvent.next(null);
    this.user = undefined;
    await this.router.navigate(['/sign-in']);
  }

  isAdmin() {
    for (const role of this.user.roles) {
      if (role.id === RoleId.RoleAdmin) return true;
    }
    return false;
  }
}
