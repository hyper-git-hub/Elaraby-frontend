
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { isSameDay } from 'date-fns';
import { isNullOrUndefined } from 'util';
import { AppLoader } from '../../core/utils/app-loader';
import { HttpController } from '../../core/interceptors/loading-controller';
import { DateUtils } from '../../core/utils/date.utils';
import { HttpStatusCodeEnum } from '../../core/enum/HttpStatusCodeEnum';
import { WaterheaterService } from '../services/waterheater.service';
import { ApiResponseWithHttpStatus } from '../../core/model/api.response';
import { Ng2ChartDataInterface } from '../../core/constants';
import { GraphHoursEnum } from '../model/24-hours.enum';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { ElementSchemaRegistry } from '@angular/compiler';


@Component({
  selector: 'app-temperature-reporting',
  templateUrl: './temperature-reporting.component.html',
  styleUrls: ['./temperature-reporting.component.css']
})
export class TemperatureReportingComponent implements OnInit, OnChanges {


  // entity id
  @Input() entityId;
  date = new Date();

  temperatureBarChartReady = false;


  public lineChartData: Array<Ng2ChartDataInterface> = [
    { data: [], label: 'Avg Temperature °C' },
    { data: [], label: 'Current Temperature Threshold °C' }

  ];

  public lineChartLabels: Array<any> = [];

  // loader for the backend call
  temperatureAppLoader = new AppLoader();
  temperatureAxisLabel = { 'x': 'Days', 'y': 'Avg Temperature °C' };


  constructor(private deviceService: WaterheaterService) {
  }

  ngOnInit() {
  }

  /***
   * Detects whenever there is a change in Input entityId.
   * A change means that the page has been reloaded, so this method resets all the data & refreshes the chart.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entityId.currentValue !== changes.entityId.previousValue) {
      this.temperatureBarChartReady = false;
      this.lineChartData[0].data = [];
      this.lineChartData[1].data = [];
      this.lineChartLabels = [];
    }
  }


  /***
   * Gets called when the user changed the date filter.
   * Converts the input dates to utc dates.
   * Calls the method to populate graph data & generate a graph
   * @param event: param emitted by the child component app-reporting. It is of the format [[start_date, end_date], type]
   */

  getReport(event) {
    const dateRange = event[0];
    const type = event[1];
    const start_date = DateUtils.getUtcDateTimeStart(dateRange[0]);
    const end_date = DateUtils.getUtcDateTimeEnd(dateRange[1]);
    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );
    this.temperatureBarChartReady = false;
    console.log(event);
    this.getTemperatureGraph(dateRange[0], dateRange[1], isDateRangeInSameDay);
  }


  /**
   * Makes an API call to retrieve temperature data.
   * Populates the lineChartData from the response data, formatting it accordingly (the ng2 charts format).
   * @param start_date
   * @param end_date
   * @param isSameDay: true if start_date=end_date
   * If isSameDay is true 'HRS' is displayed on x-axis and the timestamp is formatted in HHMM format,
   * otherwise 'Days' will be displayed by default, and the default format will be DDMM
   */

  private getTemperatureGraph(start_date, end_date, isSameDay) {
    var array = [];
    // var formatted_date = [];
    var d = new Date();
    var n = d.getTimezoneOffset();
    var hr_difference = n / 60;

    console.log('hours difference', hr_difference); //e.g utc is -5 hours to isl

    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartLabels = [];

    let params = {};
    if (isSameDay) {
      params = {
        entity_id: this.entityId,
        data_type: 'temperature',
        start_date: DateUtils.subtractDay(start_date, 1),//DateUtils.formateUtcDateTimeString(start_date),
        end_date: DateUtils.subtractDay(start_date, 1)//DateUtils.formateUtcDateTimeString(start_date)
      }
    }
    else {
      params = {
        entity_id: this.entityId,
        data_type: 'temperature',
        start_date: DateUtils.getYYYYMMDD(start_date),//DateUtils.formateUtcDateTimeString(start_date)
        end_date: DateUtils.getYYYYMMDD(end_date)//DateUtils.formateUtcDateTimeString(end_date)
      }
    }
    // console.log('params after', params);
    this.deviceService.getTemperatureGraph(params)

      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          console.log('temperature', apiResponse);
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            const response = apiResponse.response;

            if (isSameDay) {
              if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                  array.push({ index: i, time: new Date(response[i].timestamp) });
                }

                array.filter(x => {
                  if (x.time.getDate() === new Date(start_date).getDate()) {
                    // console.log(DateUtils.hrs12(x.time));
                    this.context.lineChartLabels.push(DateUtils.hrs12(x.time));
                    if (response[x.index].average_temperature == 404) {
                      this.context.lineChartData[0].data.push(0);
                    } else {
                      d
                      this.context.lineChartData[0].data.push(response[x.index].average_temperature.toFixed(2));
                    }

                    if (response[x.index].average_ctt == 404) {
                      this.context.lineChartData[1].data.push(0);
                    } else {
                      this.context.lineChartData[1].data.push(response[x.index].average_ctt.toFixed(2));
                    }
                    //   this.context.lineChartData[0].data.push(response[x.index].average_temperature.toFixed(2));
                  }
                });

              }
              this.context.temperatureAxisLabel.x = 'Hrs';
            }
            else {
              for (var i = 0; i < response.length; i++) {
                this.context.lineChartLabels.push(DateUtils.getDDMMM(response[i]['timestamp']));
                if (response[i].average_temperature == 404) {
                  this.context.lineChartData[0].data.push(0);
                } else {
                  this.context.lineChartData[0].data.push(response[i].average_temperature.toFixed(2));
                }

                if (response[i].average_ctt == 404) {
                  this.context.lineChartData[1].data.push(0);
                } else {
                  this.context.lineChartData[1].data.push(response[i].average_ctt.toFixed(2));
                }
                // this.context.lineChartData[0].data.push(response[i].average_temperature.toFixed(2));
                // this.context.lineChartData[1].data.push(response[i].average_ctt.toFixed(2));
              }
              this.context.temperatureAxisLabel.x = 'Days';

            }
            this.context.temperatureBarChartReady = true;
            // for (let i = 0; i < response.length; i++) {
            //   if (!isNullOrUndefined(response[i])) {
            //     this.context.lineChartData[0].data.push(response[i].average_temperature);
            //     this.context.lineChartData[1].data.push(response[i].average_ctt);
            //     if (isSameDay) {
            //       this.context.temperatureAxisLabel.x = 'Hrs';
            //       // const hour= ((response[i]['timestamp'].split('T')[1])).split(':')[0];
            //       this.context.lineChartLabels.push(GraphHoursEnum[i]);
            //     } else {
            //       this.context.temperatureAxisLabel.x = 'Days';
            //       this.context.lineChartLabels.push(DateUtils.getDDMMM(response[i]['timestamp']));
            //
            //     }
            //   }
            // }
            //
            // if (isSameDay) {
            //   for (var i = response.length; i < 24; i++) {
            //     this.context.lineChartLabels.push(GraphHoursEnum[i]);
            //     this.context.lineChartData[0].data.push(0);
            //   }
            // }
            // if (this.context.lineChartData[0].data.length) {
            //   this.context.temperatureBarChartReady = true;
            // }

          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.temperatureAppLoader)
      );


  }
}
