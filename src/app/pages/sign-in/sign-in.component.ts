import {Component} from '@angular/core';
import {AuthService} from '../../@core/services/auth.service';
import {NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-sign-in',
  styleUrls: ['./sign-in.component.scss'],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  inputApikey: string = '';

  constructor(private authService: AuthService, private toastrService: NbToastrService) {
  }

  async signIn() {
    try {
      await this.authService.signIn(this.inputApikey.trim());
      this.toastrService.success('Signed in!');
    } catch (e) {
      this.toastrService.danger(e.message);
    }
  }
}
