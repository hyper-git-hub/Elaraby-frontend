import {Component, Input, OnInit} from '@angular/core';
import {isSameDay} from 'date-fns';
import {isNullOrUndefined} from 'util';
import {AppLoader} from 'app/core/utils/app-loader';
import {WaterheaterService} from '../services/waterheater.service';
import {DateUtils} from '../../core/utils/date.utils';
import {HttpController} from '../../core/interceptors/loading-controller';
import {ApiResponseWithHttpStatus} from '../../core/model/api.response';
import {HttpStatusCodeEnum} from '../../core/enum/HttpStatusCodeEnum';
import {Ng2ChartDataInterface} from '../../core/constants';
import {GraphHoursEnum} from '../model/24-hours.enum';



@Component({
  selector: 'app-usage-reporting',
  templateUrl: './usage-reporting.component.html',
  styleUrls: ['./usage-reporting.component.css']
})
export class UsageReportingComponent implements OnInit {

  // device id
  @Input() entityId;

  public UsageBarChartData: Ng2ChartDataInterface[] = [
    {data: [], label: 'No. of minutes'}
  ];
  public usageChartLabels = [];

  usageBarChartReady = false;

  usageAppLoader = new AppLoader();
  usageAxisLabel =  { 'x': 'Hrs', 'y': 'No. of Minutes' };

  public barChartColors: Array<Array<any>> = [
    [{ // blue for Regular Appliance
      backgroundColor: 'rgba(50,37,195,1)'
    }],
    [{ // orange for Smart Appliances
      backgroundColor: 'rgba(255,132,0,1)'
    }]
  ];


  constructor(private deviceService: WaterheaterService) {
  }

  ngOnInit() {
  }

  /***
   * Gets called when the user changed the date filter.
   * Converts the input dates toutc dates.
   * Calls the method to populate graph data & generate a graph
   * @param event: param emitted by the child component app-reporting. It is of the format [[start_date, end_date], type]
   */
  getReport(event) {
    const dateRange = event[0];
    const type = event[1];
    // const start_date = DateUtils.getUtcDateTimeStart(dateRange[0], 'YYYY-MM-DD' );
    // const end_date = DateUtils.getUtcDateTimeStart(dateRange[1], 'YYYY-MM-DD');
    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );
    this.usageBarChartReady = false;
    this.getUsageGraph(dateRange[0], dateRange[1], isDateRangeInSameDay);

  }

  /***
   * Makes a GET Api call to fetch data & populates the UsageBarChartData data & usageChartLabels array.
   * According to the ng2-charts days syntax.
   * Set the boolean usageBarChartReady to true once data is ready & passes to the child component app-bar-chart
   * @param start_date
   * @param end_date
   * @param isSameDay: boolean to display whether the start & end date are on the same date.
   * If isSameDay is true 'HRS' is displayed on x-axis and the timestamp is formatted in HHMM format,
   * otherwise 'Days' will be displayed by default, and the default format will be DDMM

   */

  private getUsageGraph(start_date, end_date, isSameDay) {
    this.UsageBarChartData[0].data = [];
    this.usageChartLabels = [];
    var array = [];
    let params = { };
    if(isSameDay){
      params = {
        entity_id: this.entityId,
        data_type: 'usage_hours',
        start_date: DateUtils.subtractDay(start_date,1),
        end_date: DateUtils.subtractDay(start_date,1)
      }
    }
    else {
      params = {
        entity_id: this.entityId,
        data_type: 'usage_hours',
        start_date: DateUtils.getYYYYMMDD(start_date),
        end_date: DateUtils.getYYYYMMDD(end_date)
      }
    }
    this.deviceService.getUsageGraph(params)
      .subscribe(new class extends HttpController <ApiResponseWithHttpStatus<any[]>> {
          onComplete(): void {
          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);
          }

          onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
            console.log('usage hours', apiResponse);
            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              const response = apiResponse.response;

              if(isSameDay){
                if(response.length > 0) {
                  for (var i = 0; i < response.length; i++) {
                    array.push({index:i,time:new Date(response[i].timestamp)});
                    // this.context.usageChartLabels.push(GraphHoursEnum[i]);
                    // this.context.UsageBarChartData[0].data.push(DateUtils.getHoursFromMinutes(response[i].average_usage));
                  }
                  array.filter(x => {

                    if (x.time.getDate() === new Date(start_date).getDate()) {
                      // console.log(DateUtils.hrs12(x.time));
                      this.context.usageChartLabels.push(DateUtils.hrs12(x.time));
                      this.context.UsageBarChartData[0].data.push(DateUtils.getHoursFromMinutes(response[x.index].average_usage));

                      //   this.context.lineChartData[0].data.push(response[x.index].average_temperature.toFixed(2));

                  }
                  });
                  // for (var i = response.length; i < 24; i++) {
                  //   this.context.usageChartLabels.push(GraphHoursEnum[i]);
                  //   this.context.UsageBarChartData[0].data.push(0);
                  // }
                }
                this.context.usageAxisLabel.x = 'Hrs';

              }
              else {
                  for (var i = 0; i < response.length; i++) {
                    this.context.usageChartLabels.push(DateUtils.getDDMMM(response[i].timestamp));
                    this.context.UsageBarChartData[0].data.push(DateUtils.getHoursFromMinutes(response[i].average_usage));
                  }

                this.context.usageAxisLabel.x = 'Days';
              }

              this.context.usageBarChartReady = true;

              // for (let i = 0; i < response.length; i++) {
              //   if (!isNullOrUndefined(response[i])) {
              //     this.context.UsageBarChartData[0].data.push(DateUtils.getHoursFromMinutes(response[i].average_usage));
              //     if (isSameDay) {
              //       // const hour= ((response[i]['timestamp'].split('T')[1])).split(':')[0];
              //       this.context.usageChartLabels.push(GraphHoursEnum[i]);
              //
              //
              //     } else {
              //       this.context.usageChartLabels.push(DateUtils.getDDMMM(response[i].timestamp));
              //     }
              //   }
              // }
              // if (isSameDay) {
              //   for (var i = response.length; i < 24; i++) {
              //     this.context.usageChartLabels.push(GraphHoursEnum[i]);
              //     this.context.UsageBarChartData[0].data.push(0);
              //   }
              // }
              // console.log(this.context.usageChartLabels);
              // if (this.context.UsageBarChartData[0].data.length) {
              //   this.context.usageBarChartReady = true;
              // }
            } else {
              console.error(apiResponse.message);
            }
          }
        }(this, this.usageAppLoader)
      );


  }



}
