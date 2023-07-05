import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../@core/services/auth.service';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-sign-out',
  template: '<div></div>',
})
export class SignOutComponent implements OnInit {
  inputApikey: string = '';

  constructor(private authService: AuthService, private toastrService: NbToastrService) {
  }

  ngOnInit(): void {
    this.signOut();
  }

  async signOut() {
    await this.authService.signOut();
    this.toastrService.success('Signed out!');
  }
}
