import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { AnonymousGuardService } from './core/services/guards/anonymous-guard.service';
import { UnauthorizedPageComponent } from './shared/unauthorized-page/unauthorized-page.component';
import { SiteMaintenanceComponent } from './shared/site-maintenance/site-maintenance.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';


const appRoutes: Routes = [
  {
    path: 'iop',
    loadChildren: 'app/iop/iop.module#IopModule',

  },
  {
    path: 'reset_password',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    component: LoginComponent,
    canActivate: [AnonymousGuardService]
  },

  {
    path: 'maintenance',
    component: SiteMaintenanceComponent,
    canActivate: [AnonymousGuardService]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPageComponent
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)

  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
