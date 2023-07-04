import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { IopComponent } from './iop.component';
import { UserProfileComponent } from '../shared/user-profile/user-profile.component';
import { QrGenerationFormComponent } from './qr-generation-form/qr-generation-form.component';
import { RoleGuard } from '../core/services/guards/role-guard.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { AuthorizeGuard } from '../core/services/guards/authorize-guard.service';


const routes: Routes = [
  {
    path: '',
    component: IopComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full', canActivate:[AuthorizeGuard] },
      { path: 'profile', component: UserProfileComponent },
      { path: 'waterheaters', loadChildren: 'app/iop/waterheaters/waterheaters.module#WaterheatersModule', canActivate: [RoleGuard,AuthorizeGuard] },
      { path: 'qr-generator', component: QrGenerationFormComponent, pathMatch: 'full' },
      { path: 'users', component: UserManagementComponent, canActivate:[AuthorizeGuard] }, // pathMatch: 'full'
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IopRoutingModule {
}
