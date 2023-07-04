import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { differenceInCalendarDays, isSameDay } from 'date-fns';
import { AppLoader } from '../../core/utils/app-loader';
import { FormService } from '../../shared/services/form.service';
import { HttpController } from '../../core/interceptors/loading-controller';
import { HttpStatusCodeEnum } from '../../core/enum/HttpStatusCodeEnum';
import { WaterheaterService } from '../services/waterheater.service';
import { ApiResponseWithHttpStatus } from '../../core/model/api.response';
import { DatePipe } from '@angular/common';
import { TODAY_DATE_RANGE } from '../../core/constants';
import { PrimengDropdownItem } from '../../core/model/primng-dropdown-item';
import { IoPScheduleType, IoPScheduleTypeColors, IoPScheduleTypeReeverse } from '../model/schedule-type.enum';
import { DateUtils } from '../../core/utils/date.utils';

@Component({
  selector: 'app-density-reporting',
  templateUrl: './density-reporting.component.html',
  styleUrls: ['./density-reporting.component.css'],
  providers: [DatePipe]

})
export class DensityReportingComponent implements OnInit, OnChanges {

  salesChartData

  // id of entity
  @Input() entityId;

  // list of users on the device
  @Input() deviceUsers = [];

  dateRangeEventsCreated = [];
  dateRangeDensity = [];

  densityLabel: any[] = [];
  densityData: any[] = [];
  formatted_density_data: any = [];
  densityColors = [];
  densityAxisLabel = { 'x': 'Days', 'y': 'no. of Minutes' };
  loadchart: boolean = false;

  pieChartLabel: any[] = [];
  pieChartData: any[] = [];


  pieChartColors?= [
    {
      backgroundColor: [],
    }];

  densityReportingLoader = new AppLoader();
  numOfEventsReportingLoader = new AppLoader();
  today = new Date();


  eventTypeDropdown = [];
  userDropdown = [];
  selectedEvent = [];
  selectedUser = [];

  constructor(private formService: FormService,
    private deviceService: WaterheaterService,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit() {
    this.getDropdowns();
  }

  /***
   * detects changes in input. Any change means that report has to be regenerated
   * By default report is generated for Today only.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['deviceUsers']['currentValue'].length) {

    //   this.densityData = [];
    //   this.densityLabel = [];
    //   this.densityColors = [];

    //   this.pieChartLabel = [];
    //   this.pieChartData = [];

    //   this.eventTypeDropdown = [];
    //   this.userDropdown = [];

    //   this.selectedEvent = [];
    //   this.selectedUser = [];

    //   // this.getNumberOfEventsCreated([TODAY_DATE_RANGE, 'eventTypeDropdown']);

    //   this.deviceUsers = changes['deviceUsers']['currentValue'];
    // }
    console.log("changes", changes);
  }


  /***
   * get all the schedules types.
   * This method construct two dropdowns of type PrimengDropDown.
   * One is for the schedules type & the other is for users currently registerd with this waterheater
   */
  private getDropdowns() {
    this.formService.getIopEventOptionsDropdown({ option_key: 'Iop Schedule' })
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          // console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            console.log(apiResponse.response);
            this.context.eventTypeDropdown = apiResponse.response['option_values']
              .filter(item => (item.value !== IoPScheduleTypeReeverse.RECURRING_SLEEP_MODE));

            // console.log(this.context.eventTypeDropdown);
            // this.context.userDropdown = this.context.deviceUsers.map(
            //   (item) => {
            //     const pos = item['privileges']['is_admin'] ? 'Admin' : 'User';
            //     const itemName = item['first_name'] + ' ' + item['last_name'] + ' -(' + pos + ')';
            //     return new PrimengDropdownItem(item['user_id'], itemName);
            //   }
            // );
            //   this.context.selectedEvent = [2017];
          }
        }
      }(this)
      );


  }


  /***
   *
   * @param event of type app-reporting buttons. it is of the format [[start_date, end_date], type]
   * Gets data from api using a http service & generates a bar chart.
   * This method also formats the data according to the needs of bar chart (ng2-charts).
   * densityColors  are populated according to the schedule types
   */
  getDensityReporting(event) {
    // console.log("denssity reporting graph tab change= ", event);
    const btn_clicked = event[2];

    this.loadchart = false;
    const dateRange = event[0];

    const type = event[1];
    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );

    // const start_date = this.datePipe.transform(dateRange[0], 'y-M-d');
    // const end_date = this.datePipe.transform(dateRange[1], 'y-M-d');

    const start_date = DateUtils.formateUtcDateTimeString(dateRange[0]);
    const end_date = DateUtils.formateUtcDateTimeString(dateRange[1]);

    this.dateRangeDensity = dateRange;
    // this.getDropdowns();

    this.densityData = [];
    this.densityLabel = [];
    this.densityColors = [];

    let params = {
      entity_id: this.entityId,
      show_density_reporting: true,
      start_date: start_date,
      end_date: end_date,
    };

    if (event[2] == 'month')
      params['end_date'] = DateUtils.formateUtcDateTimeString(new Date().getTime());//DateUtils.formatDate(new Date, 'YYYY-MM-DD');

    // console.log(this.selectedEvent);

    if (this.selectedEvent) {
      params['type_id'] = this.selectedEvent;
    }
    if (this.selectedUser) {
      params['user_id'] = this.selectedUser;
    }

    console.log("params for Density Reporting api= ", params);
    this.deviceService.getDensityReporting(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // doc
          // console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {

          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            const response = apiResponse.response;
            console.log('density', response);

            if (!isDateRangeInSameDay) { ///week and month tab clicked
              console.log("GO TO MONTH & WEEK FUNCTION")
              this.context.densityAxisLabel.x = 'Days';
              this.context.getMonthlyAndWeeklyData(response, dateRange[0], dateRange[1]);
            }
            else { ///day and yesterdat tab clicked
              console.log("GO TO DAY & YESTERDAY FUNCTION")
              this.context.densityAxisLabel.x = 'Hrs';
              this.context.getTodayAndYesterdayData(response, dateRange[0]);
            }
            this.context.loadchart = true;

          } else {
            // console.error(apiResponse.message);
          }
          // console.log(this.context.piechan)
        }
      }(this, this.densityReportingLoader)
      );

  }

  getMonthlyAndWeeklyData(response, start_date, end_date) {
    let labels = [];
    let array = [];
    let filteredRes = response.filter(item => {
      if (new Date(item.new_start_dt).setHours(0, 0, 0, 0) >=
        new Date(start_date).setHours(0, 0, 0, 0)) {

        console.log(item.new_start_dt);
        return item
      }
    });
    for (const key of Object.keys(IoPScheduleType)) {
      let object = { label: key, data: [], stack: 'a' };
      array.push(object);
    }

    filteredRes.forEach(function (response_object) {
      if (labels.includes(DateUtils.getDDMMM(response_object['start_date']))) {
        let index = labels.indexOf(DateUtils.getDDMMM(response_object['start_date']));
        array.forEach(function (data_obj) {
          if (data_obj.label == parseInt(response_object['activity_type_id'])) {
            if (data_obj.data[index] != undefined)
              data_obj.data[index] = data_obj.data[index] + parseInt(response_object['notes']);
            else
              data_obj.data[index] = parseInt(response_object['notes']);
          }
          else {
            if (data_obj.data[index] != undefined)
              data_obj.data[index] = data_obj.data[index] + 0;
            else
              data_obj.data[index] = 0;
          }
        });
      }
      else {
        labels.push(DateUtils.getDDMMM(response_object['start_date']));
        let dd = DateUtils.getDDMMM(response_object['start_date']);
        let index = labels.indexOf(dd);
        array.forEach(function (data_obj) {
          if (data_obj.label == parseInt(response_object['activity_type_id'])) {
            if (data_obj.data[index] != undefined)
              data_obj.data[index] = data_obj.data[index] + parseInt(response_object['notes']);
            else
              data_obj.data[index] = parseInt(response_object['notes']);
          }
          else {
            if (data_obj.data[index] != undefined)
              data_obj.data[index] = data_obj.data[index] + 0;
            else
              data_obj.data[index] = 0;
          }
        });
      }
    });

    this.densityLabel = labels;
    this.densityData = array;
    console.log("this.densityData---- ", this.densityData);
    for (let i = 0; i < this.densityData.length; i++) {
      this.densityColors.push({ backgroundColor: IoPScheduleTypeColors[this.densityData[i].label] });
      this.densityData[i]['label'] = IoPScheduleType[this.densityData[i]['label']]
    }
  }

  getTodayAndYesterdayData(response, start_date) {
    const myObj = {};
    const array = [];
    console.log(new Date(start_date));
    let filteredRes = response.filter(item => {
      if (new Date(item.new_start_dt).setHours(0, 0, 0, 0) ==
        new Date(start_date).setHours(0, 0, 0, 0)) {

        console.log(item.new_start_dt);
        return item
      }
    });

    for (let i = 0; i < filteredRes.length; i++) {
      const obj = filteredRes[i];

      //date check so that after coversion to local it show records of today/yesterday only
      // console.log("new Date(obj.new_start_dt).getDate()-- ", new Date(obj.new_start_dt).getDate());
      // console.log("new Date(start_date).getDate()-- ", new Date(start_date).getDate());

      if (new Date(obj.new_start_dt).getDate() == new Date(start_date).getDate()) {
        if (obj['activity_type_id'] in myObj) {
          myObj[obj['activity_type_id']].push(obj['notes']);
          for (let j = 0; j < array.length; j++) {
            if (obj['activity_type_id'] !== array[j]) {
              myObj[array[j]].push(null);
            }
          }
        }
        else {
          myObj[obj['activity_type_id']] = [];
          array.push(obj['activity_type_id']);
          myObj[obj['activity_type_id']][i] = (obj['notes']);
          for (let j = 0; j < array.length; j++) {
            if (obj['activity_type_id'] !== array[j]) {
              myObj[array[j]].push(null);

            }
          }
        }
        this.densityLabel.push(DateUtils.utcToLocalTime(obj['new_start_dt']));
      }
      else {
        if (obj['activity_type_id'] in myObj) {
          myObj[obj['activity_type_id']].push(obj['notes']);
          for (let j = 0; j < array.length; j++) {
            if (obj['activity_type_id'] !== array[j]) {
              myObj[array[j]].push(null);
            }
          }
        }
        else {
          myObj[obj['activity_type_id']] = [];
          array.push(obj['activity_type_id']);
          myObj[obj['activity_type_id']][i] = (obj['notes']);
          for (let j = 0; j < array.length; j++) {
            if (obj['activity_type_id'] !== array[j]) {
              myObj[array[j]].push(null);

            }
          }
        }
        this.densityLabel.push(DateUtils.utcToLocalTime(obj['new_start_dt']));
      }
    }

    for (const key of Object.keys(myObj)) {
      if (key !== 'user') {
        this.densityColors.push({ backgroundColor: IoPScheduleTypeColors[key] });

        this.densityData.push({ data: myObj[key], label: IoPScheduleType[key], user: myObj['user'] });
      }
    }

  }

  getNewData(keys) {
    let formatted_Data = [];
    for (let i = 0; i < keys.length; i++) {
      var object = {
        data: [],
        label: keys[i],
        stack: 'a'
      }
      formatted_Data.push(object);
    }
    return formatted_Data;
  }

  getAllOccurences(element, array) {
    var indices = [];
    var idx = array.indexOf(element);
    while (idx != -1) {
      indices.push(idx);
      idx = array.indexOf(element, idx + 1);
    }
    // console.log(indices);
    return indices;
  }

  /***
   *
   * @param event of type app-reporting buttons. it is of the format [[start_date, end_date], type]
   * Gets data from api service. Generates pie chart from the resulting data.
   * piechartColors  are populated according to the schedule types

   */

  getNumberOfEventsCreated(event) {
    // console.log("event reporting graph tab change= ", event);
    const dateRange = event[0];
    this.dateRangeEventsCreated = dateRange;

    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );

    // const start_date = this.datePipe.transform(dateRange[0], 'y-M-d');//dateRange[0]; //DateUtils.getUtcDateTimeStart(dateRange[0]); // dateRange[0]; //this.datePipe.transform(dateRange[0], 'y-M-d'); //old format of date
    // const end_date = this.datePipe.transform(dateRange[1], 'y-M-d');//dateRange[1];//DateUtils.getUtcDateTimeStart(dateRange[1]); // dateRange[1];//this.datePipe.transform(dateRange[1], 'y-M-d');

    const start_date = this.datePipe.transform(dateRange[0], 'y-M-d'); //DateUtils.formateUtcDateTimeString(dateRange[0]);
    const end_date = this.datePipe.transform(dateRange[1], 'y-M-d'); //DateUtils.formateUtcDateTimeString(dateRange[1]);

    /// resets the previos data.
    this.pieChartData = [];
    this.pieChartLabel = [];
    this.pieChartColors = [{ backgroundColor: [] }];

    const params = {
      entity_id: this.entityId,
      start_date: start_date,
      end_date: end_date,
    };

    if (event[2] == 'month')
      params['end_date'] = DateUtils.formatDate(new Date, 'YYYY-MM-DD');

    const differenceInCalendarDays1 = differenceInCalendarDays(dateRange[1], dateRange[0]);

    console.log("params for Event Reporting api= ", params);

    this.deviceService.getEventsCreated(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // doc
          // console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          // console.log('events', apiResponse);
          if (apiResponse.status === HttpStatusCodeEnum.Success) {

            let response = apiResponse.response['data'];
            // if (differenceInCalendarDays1 < 1) {
            //   response = apiResponse.response['today'];
            // } else if (differenceInCalendarDays1 === 7) {
            //   response = apiResponse.response['week'];
            // } else {
            //   response = apiResponse.response['month'];
            // }
            let filteredDateBaseData = this.context.
              filterPieGraphResponseData(response, isDateRangeInSameDay, start_date);
            console.log("response of EVENT Reporting api= ", response);
            for (const obj of filteredDateBaseData) {
              const activity_type = obj['activity_type_id'];
              this.context.pieChartData.push(obj['num_events']);
              this.context.pieChartLabel.push(IoPScheduleType[activity_type]);
              this.context.pieChartColors[0].backgroundColor.push(IoPScheduleTypeColors[activity_type]);
            }
          } else {
            // console.error(apiResponse.message);
          }

          // console.log(this.context.pieChartData);
        }
      }(this, this.numOfEventsReportingLoader)
      );

  }

  filterPieGraphResponseData(data, isDateRangeInSameDay, start_date) {
    let filteredRes = data.filter(item => {
      if (isDateRangeInSameDay) {
        if (new Date(item.new_start_dt).setHours(0, 0, 0, 0) ==
          new Date(start_date).setHours(0, 0, 0, 0)) {

          console.log(item.new_start_dt);
          return item
        }
      } else {

        if (new Date(item.new_start_dt).setHours(0, 0, 0, 0) >=
          new Date(start_date).setHours(0, 0, 0, 0)) {
          console.log(item.new_start_dt);
          return item
        }
      }
    });
    console.log(filteredRes);
    var holder = {};

    filteredRes.forEach(function (d) {
      if (holder.hasOwnProperty(d.activity_type_id)) {
        holder[d.activity_type_id] = holder[d.activity_type_id] + d.num_events;
      } else {
        holder[d.activity_type_id] = d.num_events;
      }
    });
    console.log('holders: ', holder)
    var obj2 = [];

    for (var prop in holder) {
      obj2.push({ activity_type_id: prop, num_events: holder[prop] });
    }

    console.log(obj2);

    return obj2;
  }


}
