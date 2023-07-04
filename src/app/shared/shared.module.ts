import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnauthorizedPageComponent } from './unauthorized-page/unauthorized-page.component';
import { SiteMaintenanceComponent } from './site-maintenance/site-maintenance.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { GlobalSearchBarComponent } from './global-search-bar/global-search-bar.component';
import { RouterModule } from '@angular/router';
import {
  AutoCompleteModule,
  CalendarModule, ChipsModule, ConfirmationService, ConfirmDialogModule,
  DataList,
  DataListModule,
  DropdownModule, FileUploadModule,
  GrowlModule,
  InputMaskModule, MessageModule, MessagesModule, MultiSelectModule, ProgressBarModule,
  ProgressSpinnerModule, TooltipModule
} from 'primeng/primeng';
import { NgApexchartsModule } from "ng-apexcharts";
import { HeaderService } from './services/header.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SpinLoadingComponent } from './spin-loading/spin-loading.component';
import { UserService } from '../core/services/user.service';
import { FormService } from './services/form.service';
import { DataTransferService } from './services/data-transfer.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DataNotFoundComponent } from './data-not-found/data-not-found.component';
import { ChartsModule } from 'ng2-charts';
import { DashboardService } from '../iop/services/dashboard.service';
import { ReportingButtonComponent } from './reporting-button/reporting-button.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DatatableService } from './services/datatable.service';
import { TableSearchComponent } from './table-search/table-search.component';
import { MapOverlayComponentComponent } from './map-overlay-component/map-overlay-component.component';
import { GotoPageService } from './services/goto-page.service';
import { ItemMetaInformationComponent } from './item-meta-information/item-meta-information.component';
import { LiveDataStripComponent } from './live-data-strip/live-data-strip.component';
import { LinechartComponent } from './linechart/linechart.component';
import { ExportCsvComponent } from './export-csv/export-csv.component';
import { TableModule } from 'primeng/table';
import { StackedChartComponent } from './stacked-chart/stacked-chart.component';
import { SwalService } from '../core/services/swal.service';

const primengModules = [
  AutoCompleteModule,
  DataListModule,
  DropdownModule,
  MultiSelectModule,
  GrowlModule,
  CalendarModule,
  InputMaskModule,
  ProgressSpinnerModule,
  ProgressBarModule,
  NgxDatatableModule,
  TooltipModule,
  ChipsModule,
  FileUploadModule,
  MessagesModule,
  MessageModule,
  ConfirmDialogModule,
  TableModule,
];

const commonModules = [
  FormsModule,
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  LoadingBarRouterModule,
  ChartsModule
];

const components = [
  BreadcrumbsComponent, SpinLoadingComponent, HeaderComponent,
  SidebarComponent, FooterComponent, PieChartComponent, ItemMetaInformationComponent,
  DataNotFoundComponent, ReportingButtonComponent, BarChartComponent,
  TableSearchComponent, MapOverlayComponentComponent, LiveDataStripComponent,
  ExportCsvComponent, LinechartComponent, StackedChartComponent
];

const services = [HeaderService, UserService, FormService, DataTransferService,
  DashboardService, DatatableService, GotoPageService, ConfirmationService, SwalService
];

@NgModule({
  imports: [
    commonModules,
    primengModules,
    NgApexchartsModule
  ],
  exports: [
    components,
    primengModules,
    commonModules,
  ],
  declarations: [LoginComponent,
    UserProfileComponent,
    LoginFormComponent,
    UnauthorizedPageComponent,
    SiteMaintenanceComponent,
    ResetPasswordComponent, GlobalSearchBarComponent, components, StackedChartComponent,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [services]
    };
  }
}
