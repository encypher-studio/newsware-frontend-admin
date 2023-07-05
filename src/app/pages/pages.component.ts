import {Component} from '@angular/core';

import {MENU_ITEMS} from './pages-menu';
import {AuthService} from '../@core/services/auth.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;

  constructor(authService: AuthService) {
    authService.changedAuthStateEvent.subscribe(() => {
      console.log('triggered');
      const isSignedIn = authService.isSignedIn();
      this.menu[1].hidden = isSignedIn;
      this.menu[2].hidden = !isSignedIn;
    });
  }
}
