import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WaterheatersDashboardComponent} from './waterheaters-dashboard/waterheaters-dashboard.component';
// import {ConnectionResolver} from '../../core/route.resolver';
import {WaterheatersPageComponent} from './waterheaters-page/waterheaters-page.component';

const routes: Routes = [
  {
    path: '',
    component: WaterheatersDashboardComponent,
    // resolve: {connection: ConnectionResolver},
  },
  {
    path: ':id',
    component: WaterheatersPageComponent,
    // resolve: {connection: ConnectionResolver},
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaterheatersRoutingModule { }
