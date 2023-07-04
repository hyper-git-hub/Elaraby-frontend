import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IopRoutingModule } from './iop-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { IopComponent } from './iop.component';
import { SensorsTabComponent } from './sensors-tab/sensors-tab.component';
import { DensityReportingComponent } from './density-reporting/density-reporting.component';
import { FormsModule } from '@angular/forms';
import { EnergyConsumptionReportingComponent } from './energy-consumption-reporting/energy-consumption-reporting.component';
import { TemperatureReportingComponent } from './temperature-reporting/temperature-reporting.component';
import { UsageReportingComponent } from './usage-reporting/usage-reporting.component';
import { QrGenerationFormComponent } from './qr-generation-form/qr-generation-form.component';
import { ConvertPasswordPipe } from './pipes/convert-password.pipe';
import { QrcodeService } from './services/qrcode.service';
import { RoleGuard } from '../core/services/guards/role-guard.service';
import { UserManagementComponent } from './user-management/user-management.component';
import { AuthorizeGuard } from '../core/services/guards/authorize-guard.service';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IopRoutingModule,
  ],
  providers: [QrcodeService, RoleGuard,AuthorizeGuard],
  exports: [SensorsTabComponent, DensityReportingComponent, EnergyConsumptionReportingComponent, TemperatureReportingComponent, UsageReportingComponent, ConvertPasswordPipe],
  declarations: [DashboardComponent, IopComponent, SensorsTabComponent, DensityReportingComponent,
    EnergyConsumptionReportingComponent, TemperatureReportingComponent, UsageReportingComponent,
    QrGenerationFormComponent, ConvertPasswordPipe, UserManagementComponent]
})
export class IopModule {
}
