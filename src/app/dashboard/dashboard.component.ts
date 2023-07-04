import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiResponseWithHttpStatus } from '../core/model/api.response';
import { HttpController } from '../core/interceptors/loading-controller';
import { DashboardService } from '../iop/services/dashboard.service';
import { HttpStatusCodeEnum } from '../core/enum/HttpStatusCodeEnum';
import { PercentageDifference } from '../core/utils/percentageDifference';
import { AppLoader } from '../core/utils/app-loader';
import { DateUtils } from '../core/utils/date.utils';
import { IoPDeviceTypesEnum } from '../iop/model/IopDeviceEnum';
import { isSameDay } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {


  // for breadcrumbs
  home = { label: 'Dashboard', url: '/iop' };


  //  used for count
  devices = new IoPDevices();


  // totat count of devices
  devices_count = 0;


  // for pie chart
  pieChartData: any = [];
  pieChartLabel: any = [];


  saleTrends: any = {};

  legendsObj = {
    display: true,
    position: 'bottom',
    labels: {
      boxWidth: 10,
    },

  };
  datasets = [
    {
      label: '',
      data: []
    },

  ];
  private labels = [];


  saleTrendLoader = new AppLoader();
  soldGraphLoader = new AppLoader();


  constructor(private dashboardService: DashboardService) {
    // this.connection = this.route.snapshot.data['connection'];
    // this.connection.status.subscribe((s) => console.warn('lala', s.name));

  }

  ngOnInit() {
    // this.setupSignalR();
    this.getSaleTrends();
    this.getDevicesCount();
  }


  /***
   * Get sales trend & calculate percentage differences
   */
  getSaleTrends() {
    this.dashboardService.getSoldStats()
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          console.log('devices sale trends', apiResponse);
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.saleTrends = apiResponse.response[0];
            this.context.saleTrends['this_week_percentage'] =
              PercentageDifference.calculateDifference(
                this.context.saleTrends.sold_last_week || 0,
                this.context.saleTrends.sold_this_week || 0);
            this.context.saleTrends['week_status'] = this.context.saleTrends['this_week_percentage'] < 0 ? 'less' : 'more';
            this.context.saleTrends['this_week_percentage'] = Math.abs(this.context.saleTrends['this_week_percentage']);

            this.context.saleTrends['this_month_percentage'] =
              PercentageDifference.calculateDifference(
                this.context.saleTrends.sold_last_month || 0,
                this.context.saleTrends.sold_this_month || 0);
            this.context.saleTrends['month_status'] = this.context.saleTrends['this_month_percentage'] < 0 ? 'less' : 'more';
            this.context.saleTrends['this_month_percentage'] = Math.abs(this.context.saleTrends['this_month_percentage']);

            this.context.saleTrends['this_year_percentage'] =
              PercentageDifference.calculateDifference(
                this.context.saleTrends.sold_last_year || 0,
                this.context.saleTrends.sold_this_year || 0);

            this.context.saleTrends['year_status'] = this.context.saleTrends['this_year_percentage'] < 0 ? 'less' : 'more';
            this.context.saleTrends['this_year_percentage'] = Math.abs(this.context.saleTrends['this_year_percentage']);
          }

        }
      }(this, this.saleTrendLoader)
      );
  }


  /***
   * Gets devices count for each device type
   * Populates piechart accordingly
   */
  getDevicesCount() {
    this.dashboardService.getCountsForCards()
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          console.log('devices count', apiResponse);
          const response = apiResponse.response;

          for (let i = 0; i < response.length; i++) {
            if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.WATER_HEATER) {
              this.context.devices.water_heater = (response[i].device_count);
            } else if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.REFRIGIRATOR) {
              this.context.devices.refrigerator = (response[i].device_count);
            } else if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.AIR_CONDITIONER) {
              this.context.devices.air_conditioner = (response[i].device_count);
            } else if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.WASHING_MACHINE) {
              this.context.devices.washing_machine = (response[i].device_count);
            } else if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.DEEP_FREEZER) {
              this.context.devices.deep_freezer = (response[i].device_count);
            } else if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.WATER_DISPENSER) {
              this.context.devices.water_dispenser = (response[i].device_count);
            }
            this.context.devices_count += response[i].device_count;
          }
          this.context.populatePieChart();
        }
      }(this)
      );
  }

  /**
   * Populated piechart data & label
   */
  populatePieChart() {
    if (this.devices.water_heater > 0) {
      // this.pieChartData.push(Math.round((this.devices.water_heater*100)/this.devices_count));
      this.pieChartData.push(((this.devices.water_heater * 100) / this.devices_count).toFixed(1));
      this.pieChartLabel.push('Water Heater');
    }
    if (this.devices.refrigerator > 0) {
      // this.pieChartData.push(Math.round((this.devices.refrigerator*100)/this.devices_count));
      this.pieChartData.push(((this.devices.refrigerator * 100) / this.devices_count).toFixed(1));
      this.pieChartLabel.push('Refrigerator');
    }
    if (this.devices.water_dispenser > 0) {
      // this.pieChartData.push(Math.round((this.devices.water_dispenser*100)/this.devices_count));
      this.pieChartData.push(((this.devices.water_dispenser * 100) / this.devices_count).toFixed(1));
      this.pieChartLabel.push('Water Dispenser');
    }
    if (this.devices.air_conditioner > 0) {
      // this.pieChartData.push(Math.round((this.devices.air_conditioner*100)/this.devices_count));
      this.pieChartData.push(((this.devices.air_conditioner * 100) / this.devices_count).toFixed(1));
      this.pieChartLabel.push('Air Conditioner');
    }
    if (this.devices.washing_machine > 0) {
      // this.pieChartData.push(Math.round((this.devices.washing_machine *100)/this.devices_count));
      this.pieChartData.push(((this.devices.washing_machine * 100) / this.devices_count).toFixed(1));
      this.pieChartLabel.push('Washing Machine');
    }
    if (this.devices.deep_freezer > 0) {
      // this.pieChartData.push(Math.round((this.devices.deep_freezer*100)/this.devices_count));
      this.pieChartData.push(((this.devices.deep_freezer * 100) / this.devices_count).toFixed(1));
      this.pieChartLabel.push('Deep Freezer');
    }
  }


  /***
   * Gets
   * @param event: array of format [[start_date, end_date], type of chart/reporting]
   */
  setupReport(event) {
    const dateRange = event[0];
    this.datasets[0].data = [];
    this.labels = [];
    const start_date = DateUtils.getYYYYMMDD(dateRange[0]);
    const end_date = DateUtils.getYYYYMMDD(dateRange[1]);
    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );
    this.getSoldGraph(start_date, end_date, isDateRangeInSameDay);
  }


  private getSoldGraph(start_date?, end_date?, isSameDay?) {
    this.datasets = [
      {
        label: 'Water Heater',
        data: []
      }];
    this.labels = [];
    let params =  {
      start_date: start_date,
      end_date: end_date
    };

    // if (isSameDay) {
    //   params = {
    //     start_date: end_date,
    //     end_date: end_date
    //   };
    // }
    // else {
    //   params = {
    //     start_date: start_date,
    //     end_date: end_date
    //   };
    // }


    this.dashboardService.getSoldGraph(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          console.log('devices sold graph', apiResponse);
          let sum = 0;
          const obj = {};
          const response = apiResponse.response;
          for (let i = 0; i < response.length; i++) {
            if (response[i].entity_sub_type_id === IoPDeviceTypesEnum.WATER_HEATER) {
              sum += +(response[i].device_count);
              obj['Water Heater'] = sum;
            }

          }
          
          for (const key of Object.keys(obj)) {
            this.context.datasets[0].data.push(obj[key]);
            this.context.datasets[0].label = (key);
            this.context.labels.push(key);
          }

          console.log('graph data', this.context.datasets, this.context.labels);
          this.context.datasets = [...this.context.datasets];
        }
      }(this, this.soldGraphLoader)
      );
  }


}


export class IoPDevices {
  water_heater = 0;
  refrigerator = 0;
  water_dispenser = 0;
  air_conditioner = 0;
  washing_machine = 0;
  deep_freezer = 0;
}
