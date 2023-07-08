import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';

import {throwIfAlreadyLoaded} from './module-import-guard';
import {ApiService} from './services/api.service';
import {AuthService} from './services/auth.service';
import {LoginActivateGuard} from './guards/login-activate.guard';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ApiService,
        AuthService,
        LoginActivateGuard,
      ],
    };
  }
}
