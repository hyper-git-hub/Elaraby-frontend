import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { WaterheatersRoutingModule } from './waterheaters-routing.module';
import { WaterheatersPageComponent } from './waterheaters-page/waterheaters-page.component';
import { WaterheatersDashboardComponent } from './waterheaters-dashboard/waterheaters-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { WaterheaterService } from '../services/waterheater.service';
import { AbsolutePipe } from '../pipes/absolute.pipe';
import { GetNullorUndefinedPipe } from '../pipes/get-nullor-undefined.pipe';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from '../../core/interceptors/tokenInsertion.interceptor';
import { IopModule } from '../iop.module';
import { StatusConvertPipe } from '../pipes/status-convert.pipe';

import { PaginationModule } from 'ngx-bootstrap/pagination';

export let google;
export let MarkerClusterer: any;

const interceptors: any = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: DefaultInterceptor,
    multi: true,
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WaterheatersRoutingModule,
    FormsModule,
    IopModule,
    PaginationModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyASI7bo-I7oh_xwVX_IoEHI7fawh3VqSuE',
      libraries: ['places']
    }),
    AgmJsMarkerClustererModule
    
  ],
  providers: [WaterheaterService],
  declarations: [WaterheatersPageComponent, WaterheatersDashboardComponent, AbsolutePipe, GetNullorUndefinedPipe, StatusConvertPipe]
})
export class WaterheatersModule {
}
