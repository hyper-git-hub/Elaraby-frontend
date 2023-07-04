import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { differenceInCalendarDays, isSameDay } from 'date-fns';
import { AppLoader } from '../../core/utils/app-loader';
import { WaterheaterService } from '../services/waterheater.service';
import { HttpController } from '../../core/interceptors/loading-controller';
import { HttpStatusCodeEnum } from '../../core/enum/HttpStatusCodeEnum';
import { ApiResponseWithHttpStatus } from '../../core/model/api.response';
import { DateUtils } from '../../core/utils/date.utils';
import { GraphHoursEnum } from '../model/24-hours.enum';
@Component({
  selector: 'app-energy-consumption-reporting',
  templateUrl: './energy-consumption-reporting.component.html',
  styleUrls: ['./energy-consumption-reporting.component.css']
})
export class EnergyConsumptionReportingComponent implements OnInit, OnChanges {


  @Input() entityId;

  energyBarChartReady = false;
  energyChartData = [
    { data: [], label: 'Smart Appliance' },
    { data: [], label: 'Regular Appliance' },
  ];
  energyChartLabel = [];
  saving_factor = null;


  lineChartColors = [
    { // blue for Regular Appliance
      borderColor: 'rgba(50,37,195,1)',
      pointBackgroundColor: 'rgba(50,37,195,1)',
      pointBorderColor: 'rgba(50,37,195,1)',
      backgroundColor: 'rgba(50,37,195,1)',
    },
    { // orange for Smart Appliance
      borderColor: 'rgba(255,132,0,1)',
      pointBackgroundColor: 'rgba(255,132,0,1)',
      pointBorderColor: 'rgba(255,132,0,1)',
      backgroundColor: 'rgba(255,132,0,1)',


    },
  ];
  energyAxisLabels = { 'x': 'Days', 'y': 'Energy Consumption (kWh)' };
  energyAppLoader = new AppLoader();

  constructor(private deviceService: WaterheaterService) {
  }

  ngOnInit() {
  }

  /**
   * Detects changes in entity id. In case of a change. Report will be regenerated
   * @param changes of type simple changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entityId.currentValue !== changes.entityId.previousValue) {
      this.saving_factor = null;
      this.energyBarChartReady = false;
      this.energyChartData = [{ data: [], label: 'Smart Appliance' }, { data: [], label: 'Regular Appliance' }];
      this.energyChartLabel = [];

    }
  }


  /***
   * Method get calls when user selects any of the app-reporting button.
   * @param event of type [[start_date, end_date], type]
   */
  getReport(event) {
    this.saving_factor = null;
    const dateRange = event[0];
    const type = event[1];

    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );
    const differenceInCalendarDays1 = differenceInCalendarDays(dateRange[1], dateRange[0]);
    const isWeek = differenceInCalendarDays1 >= 1 && differenceInCalendarDays1 <= 8;
    const isMonth = differenceInCalendarDays1 > 8 && differenceInCalendarDays1 <= 30;

    this.energyBarChartReady = false;
    this.getEnergyGraph(dateRange[0], dateRange[1], isDateRangeInSameDay);

  }

  /***
   *
   * @param isToday: boolean if date selected is today
   * @param isWeek: true if date range is for a week
   * @param isMonth: true if daterange is for a month
   *
   * fetches api result. By default this api brings data for today, week & month. We only changes the data being displayed when user changes any date.
   * But it is important to fetch fresh data everytime that is why it wasn't implemented static.
   */
  private getEnergyGraph(start_date, end_date, isSameDay) {
    this.energyChartData = [{ data: [], label: 'Smart Appliance' }, { data: [], label: 'Regular Appliance' }];
    this.energyChartLabel = [];
    let params = {};
    var array = [];
    if (isSameDay) {

      params = {
        entity_id: this.entityId,
        data_type: 'energy',
        start_date: DateUtils.subtractDay(start_date, 1),//DateUtils.subtractDay(DateUtils.formateUtcDateTimeString(start_date), 1),//
        end_date: DateUtils.subtractDay(start_date, 1)//DateUtils.subtractDay(DateUtils.formateUtcDateTimeString(start_date), 1)//
      }

      // DateUtils.formateUtcDateTimeString(dateRange[0])

    }
    else {
      params = {
        entity_id: this.entityId,
        data_type: 'energy',
        start_date: DateUtils.getYYYYMMDD(start_date),//DateUtils.formateUtcDateTimeString(start_date)
        end_date: DateUtils.getYYYYMMDD(end_date) //DateUtils.formateUtcDateTimeString(end_date)
      }
    }

    this.deviceService.getEnergyConsumptionGraph(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // doc
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          console.log('energy consumed graph', apiResponse);
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            let response = apiResponse.response;

            this.context.saving_factor = 0;
            if (isSameDay) {
              if (response.length > 0) {
                for (var i = 0; i < response.length - 1; i++) {
                  array.push({ index: i, time: new Date(response[i].timestamp) });
                  // this.context.energyChartLabel.push(GraphHoursEnum[i]);
                  // this.context.energyChartData[0].data.push(response[i]['smart_energy']);
                  // this.context.energyChartData[1].data.push(response[i]['regular_energy']);
                }
                array.filter(x => {
                  if (x.time.getDate() === new Date(start_date).getDate()) {
                    // console.log(DateUtils.hrs12(x.time));
                    this.context.energyChartLabel.push(DateUtils.hrs12(x.time));
                    this.context.energyChartData[0].data.push(response[x.index].smart_energy);
                    this.context.energyChartData[1].data.push(response[x.index].regular_energy);
                    if (response[x.index]['total_saving']) {
                      this.context.saving_factor += Number(response[x.index]['total_saving']);
                    }
                    //   this.context.lineChartData[0].data.push(response[x.index].average_temperature.toFixed(2));
                  }
                });
                // for (var i = response.length - 1; i < 24; i++) {
                //   this.context.energyChartLabel.push(GraphHoursEnum[i]);
                //   this.context.energyChartData[0].data.push(0);
                //   this.context.energyChartData[1].data.push(0);
                // }
              }
              this.context.energyAxisLabels.x = 'Hrs';

            }
            else {
              if (response.length > 0) {

                for (var i = 0; i < response.length - 1; i++) {
                  this.context.energyChartLabel.push(DateUtils.getDDMMM(response[i]['timestamp']));
                  this.context.energyChartData[0].data.push(response[i]['smart_energy']);
                  this.context.energyChartData[1].data.push(response[i]['regular_energy']);
                  if (response[i]['total_saving']) {
                    this.context.saving_factor += Number(response[i]['total_saving']);
                  }
                }
                this.context.energyAxisLabels.x = 'Days';
              }
            }

            console.log(this.context.saving_factor);

            this.context.energyBarChartReady = true;


            // if (isMonth) {
            //   response = apiResponse.response['month'];
            //   this.context.saving_factor = response['saving'];
            //
            //   for (const obj of response['smart_appliance']) {
            //     this.context.energyChartData[0].data.push(obj['energy']);
            //   }
            //   for (const obj of response['regular_appliance']) {
            //     this.context.energyChartLabel.push(DateUtils.getDDMMM(DateUtils.getMMDDYYYYhhmmssA(obj['date2'])));
            //     this.context.energyChartData[1].data.push(obj['energy']);
            //   }
            //   this.context.energyAxisLabels.x = 'Days';
            // } else if (isWeek) {
            //   response = apiResponse.response['week'];
            //   this.context.saving_factor = response['saving'];
            //
            //   for (const obj of response['smart_appliance']) {
            //     this.context.energyChartData[0].data.push(obj['energy']);
            //   }
            //   for (const obj of response['regular_appliance']) {
            //
            //     this.context.energyChartLabel.push(DateUtils.getDDMMM(DateUtils.getMMDDYYYYhhmmssA(obj['date2'])));
            //     this.context.energyChartData[1].data.push(obj['energy']);
            //   }
            //   this.context.energyAxisLabels.x = 'Days';
            // } else {
            //
            //   response = apiResponse.response['today'];
            //   this.context.energyAxisLabels.x = 'Hrs';
            //   this.context.saving_factor = response['saving'];
            //
            //   for (var i=0; i<response['smart_appliance'].length;i++) {
            //
            //     this.context.energyChartLabel.push(GraphHoursEnum[i]);
            //     this.context.energyChartData[0].data.push(response['smart_appliance'][i]['energy']);
            //   }
            //   for (const obj of response['regular_appliance']) {
            //     this.context.energyChartData[1].data.push(obj['energy']);
            //   }
            // }



          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.energyAppLoader)
      );

  }

}
