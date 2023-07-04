import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './services/guards/module-import-guard';
import { SwalService } from './services/swal.service';
import { UserService } from './services/user.service';
import { AnonymousGuardService } from './services/guards/anonymous-guard.service';
import { AuthService } from './services/auth.service';
// import { AuthorizeGuard } from './services/authorized-guard.service';
import { AuthGuard } from './services/guards/auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './interceptors/tokenInsertion.interceptor';
import { AuthorizeGuard } from './services/guards/authorize-guard.service';




const interceptors: any = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: DefaultInterceptor,
    multi: true,
  }
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AuthService, UserService, AnonymousGuardService, AuthGuard, SwalService, AuthorizeGuard, interceptors]

})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
