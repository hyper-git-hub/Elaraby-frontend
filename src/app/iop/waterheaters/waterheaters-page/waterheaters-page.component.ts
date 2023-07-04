import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceErrorEnum, Power } from '../../model/device-error.enum';
import { IoPScheduleType } from '../../model/schedule-type.enum';
import { DateUtils } from '../../../core/utils/date.utils';
import { isSameDay } from 'date-fns';
import { ApiResponseWithHttpStatus } from '../../../core/model/api.response';
import { HttpStatusCodeEnum } from '../../../core/enum/HttpStatusCodeEnum';
import { PercentageDifference } from '../../../core/utils/percentageDifference';
// import { BroadcastEventListener, SignalRConnection } from 'wfw-ngx-signalr';
import { AppLoader } from '../../../core/utils/app-loader';
import { IopsignalRresponse } from '../../model/iopsignalRresponse';
import { DeviceStateEnum } from '../../model/device-state.enum';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from '../../../core/services/swal.service';
import { HttpController } from '../../../core/interceptors/loading-controller';
import { Subscription } from 'rxjs/Subscription';
import { WaterheaterService } from '../../services/waterheater.service';
import { Item } from '../../model/item';
import { EntityResponse } from '../../model/entity.response';
import { isNullOrUndefined } from '@swimlane/ngx-datatable/release/utils';
import { DatePipe } from '@angular/common';
import { SignalRService } from '../../../core/services/signal-r.service';
declare var $: any;
@Component({
  selector: 'app-waterheaters-page',
  templateUrl: './waterheaters-page.component.html',
  styleUrls: ['./waterheaters-page.component.css'],
  providers: [DatePipe,SignalRService]
})
export class WaterheatersPageComponent implements OnInit, OnDestroy {

  displayData: boolean;
  displayError = false;
  heaterMetaInfo: any;
  user_android_info: any = {};

  // id of waterheater currently activated
  entityId;

  // holds the meta information retrieved from backend using id
  device = new EntityResponse();
  errorMessage = '';
  activeTab = 1;

  // 'd' key in signalR response, being used in meta deta
  hardwareVersion = '';
  softwareVersion = '';
  identityExpiry = '';

  // States of enum, being used in html file. That is why it has been declared as a separate component variable
  DeviceStateEnum = DeviceStateEnum;
  IoPScheduleType = IoPScheduleType;

  // boolean flg to represent if real time data has been received/or device is online
  dataReceived;

  // SignalR connection
  // private connection: SignalRConnection;
  private subscription: Subscription;
  signalRSubscription = new Subscription;

  // breadcrumbs
  items = [{ label: 'Water Heaters', url: '/iop/waterheaters/' }, { label: 'Water Heater' }];
  home = { label: 'Dashboard', url: '/iop' };

  // array to hold errors
  errorLogs = [];
  signalRerrorLogs = [];
  errorLoader = new AppLoader();

  // array of all the users on current device
  deviceUsers = [];

  // Object to store card values for today
  todayStats = { energy_consumed: 0, events_created: 0, err_data: 0 };
  dayStatsLoader = new AppLoader();

  // usageStats = {this_day_percentage: 0, this_week_percentage: 0, this_month_percentage: 0, this_year_percentage: 0};
  usageStats = {
    this_day_percentage: 0,
    this_week_percentage: 0,
    this_month_percentage: 0,
    this_year_percentage: 0,
    last_week_average: 0,
    this_week_average: 0,
    this_day_average: 0,
    last_day_average: 0,
    last_month_average: 0,
    this_month_average: 0,
    last_year_average: 0,
    this_year_average: 0,
  };
  usageCardLoader = new AppLoader();

  // binds to the 'd' key from signalR response
  signalsStrength = 0;

  // flag to display signal strengths of this device
  showSignals = false;
  densityData = [];
  densityDataLoader: boolean = false;
  getTodayRange = [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)];

  constructor(private route: ActivatedRoute,
    public swalService: SwalService,
    private signalRService: SignalRService,
    public deviceService: WaterheaterService,
    private datePipe: DatePipe) {

    this.route.params.subscribe(params => {
      this.entityId = +params['id']; // (+) converts string 'id' to a number
      // console.log("this.entityId= ", this.entityId);

      // this.connection = this.route.snapshot.data['connection'];
      // this.connection.status.subscribe((s) => console.warn(s.name));

      this.resetPage();
      // this.getDevice();
      // this.getDayStats();
      // this.getErrorLogs();
    });

  }


  ngOnInit() {
    // setTimeout(() =>
    //   console.log("this.device== ", this.device)
    //   , 4000)

    this.getDevice();
    this.getDayStats();
    this.getErrorLogs();

  }

  /***
   * Method to reset all stats/data/arrays to original state.
   * Used when page reloads & there is a change in params id.
   * When user, while on a single waterheater page, searches & redirects to another waterheater from global search bar. The whole view will refresh & resets
   */
  resetPage() {
    this.errorLogs = [];
    this.deviceUsers = [];
    this.items = [{ label: 'Water Heaters', url: '/iop/waterheaters/' }, { label: 'Water Heater' }];
  }

  /**
   * Makes a HTTP call and retrieves today stats for cards.
   * Params: entityId
   */
  private getDayStats() {
    this.todayStats = { energy_consumed: 0, events_created: 0, err_data: 0 };
    const params = { entity_id: this.entityId };
    this.deviceService.getDeviceDayStats(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // doc
          console.log("errorMessage (getDeviceDayStats apiResponse)= ", errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            const response = apiResponse.response;
            this.context.todayStats = response;
            this.context.todayStats.events_created = 0;
            this.context.getDensityData(this.context.getTodayRange, true)
            this.context.deviceUsers = response['users'];
          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.dayStatsLoader)
      );
  }

  /***
   * Gets usage trends for day (today & yesterday),week (current & last week), month (current & last) & year (current & last).
   * Calculate percentage difference between all these above mentioned values.
   * Display percentage fall/rise accordingly
   */

  private getUsageStats() {
    this.usageStats = {
      this_day_percentage: 0,
      this_week_percentage: 0,
      this_month_percentage: 0,
      this_year_percentage: 0,
      last_week_average: 0,
      this_week_average: 0,
      this_day_average: 0,
      last_day_average: 0,
      last_month_average: 0,
      this_month_average: 0,
      last_year_average: 0,
      this_year_average: 0,
    };
    this.deviceService.getUsageStats({ entity_id: this.entityId })
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          this.context.swalService.getErrorSwal(errorMessage);
          // do
          console.log("getUsageStats (getUsageStats apiresponse)", errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {

          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            console.log('usage stats (inside if condition)=', apiResponse.response);

            this.context.usageStats = apiResponse.response[0];
            this.context.usageStats.this_day_percentage =
              PercentageDifference.calculateDifference(
                this.context.usageStats.last_day_average || 0,
                this.context.usageStats.this_day_average || 0);
            this.context.usageStats.this_week_percentage =
              PercentageDifference.calculateDifference(
                this.context.usageStats.last_week_average || 0,
                this.context.usageStats.this_week_average || 0);
            this.context.usageStats.this_month_percentage =
              PercentageDifference.calculateDifference(
                this.context.usageStats.last_month_average || 0,
                this.context.usageStats.this_month_average || 0);
            this.context.usageStats.this_year_percentage =
              PercentageDifference.calculateDifference(
                this.context.usageStats.last_year_average || 0,
                this.context.usageStats.this_year_average || 0);


          } else {
            console.log('usage stats (inside else condition)=', apiResponse.response);

            // this.context.swalService.getErrorSwal(apiResponse.message);
          }
        }
      }(this, this.usageCardLoader)
      );
  }

  /***
   * Populates object for meta information component.
   */
  private setupMetaInfo() {
    this.heaterMetaInfo = [
      new Item('Device', this.device['device_name_method'] || '-'),
      new Item('Model Type', this.device['leased_owned_name'] || '-'),
      new Item('Capacity (Ltr)', this.device['volume_capacity'] || '-'),
      new Item('Frequency (Hz)', (this.device['cnic'] || '-') + ' Hz'),
      new Item('Power (Watt)', this.device['age'] || '-'),
      new Item('Type', this.device['type'] || '-'),
      new Item('Dimensions (mm)', this.device['ethnicity'] || '-'),
      new Item('Classification', this.device['past_club'] || '-'),
      new Item('Hardware Version', this.hardwareVersion || '-'),
      new Item('Firmware Version', this.softwareVersion || '-'),
      new Item('Identity Expiry', this.identityExpiry || '-'),
    ];
  }

  /***
   * Makes an API call and retrieves single waterheater object. While passing entityId as params.
   * Sets initial signalR object on device object.
   * Calls signalR setup method.
   * Calls Meta info function.
   * Calls Usage Stats function
   */

  UserClicked(user_id) {
    // console.log(user_id);

    const params = { user_id: user_id };
    this.user_android_info = 'null';
    this.deviceService.getUser(params).subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
      onComplete(): void {
      }

      onError(errorMessage: string, err: any) {
        this.context.swalService.getErrorSwal(errorMessage);
        // do
        // console.log(errorMessage);
      }

      onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
        console.log('user android info', apiResponse);
        if (apiResponse.status === HttpStatusCodeEnum.Success) {

          if (apiResponse.response['device_detail'] == undefined) {
            this.context.user_android_info == 'null';
          }
          else {
            this.context.user_android_info = apiResponse.response['device_detail'];
            this.context.user_android_info = JSON.parse(this.context.user_android_info);
          }

          this.context.verifyFirmware(apiResponse.response.registration);
          this.context.setupMetaInfo();
          this.context.setupSignalR();
          this.context.getUsageStats();
          this.context.dataReceived = apiResponse.response.online_status;
        }
        if (apiResponse.status === HttpStatusCodeEnum.Error) {
          this.context.swalService.getErrorSwal(apiResponse.message);
        }
      }
    }(this)
    );

  }

  private getDevice() {
    this.deviceService.getEntity(this.entityId)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          this.context.swalService.getErrorSwal(errorMessage);
          // do
          console.log("getEntity (errors)", errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
          console.log('getEntity() response [device]=', apiResponse, apiResponse.response.length);

          if (apiResponse.response != undefined) {
            if (apiResponse.response.length == 0) {
              // For ids that doesnot exists in db
              //  console.log("data does not exists")
              this.context.displayData = false;
              this.context.displayError = true;
            } else {
              // For ids that exists in db
              // console.log("data does exists")
              this.context.displayData = true;
              this.context.displayError = false;
            }
          }

          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.device = apiResponse.response;
            this.context.device['active_hrs_yesterday'] = DateUtils.getHoursFromMinutes(this.context.device['active_hrs_yesterday']);
            this.context.signalRService.init(this.context.device.device_name_method)
            this.context.device['signalRresponse'] = new IopsignalRresponse(
              apiResponse.response['device_name_method'],
              apiResponse.response.last_updated || '-',     //last updated
              apiResponse.response.cht || 0,  //flange temp
              apiResponse.response.last_volume,           //device state
              apiResponse.response.ctt,                  //desired temp
              apiResponse.response.error_log,           //Recent error
              apiResponse.response.registration,        //
              apiResponse.response.cdt,                 //Display temp
              apiResponse.response.clm                  //Lock mode
              // apiResponse.response.name
            );


            // this.context.signalRresponse = this.context.device['signalRresponse'];

            this.context.verifyFirmware(apiResponse.response.registration);
            this.context.setupMetaInfo();
            this.context.setupSignalR();
            this.context.getUsageStats();
            this.context.dataReceived = apiResponse.response.online_status;
          }
          if (apiResponse.status === HttpStatusCodeEnum.Error) {
            this.context.swalService.getErrorSwal(apiResponse.message);
          }
        }
      }(this)
      );
  }

  /***
   * Connects & receives packets from signalR
   * Updates device's signalR object with the latest packet
   * Append recent errors for error logs.
   */


  setupSignalR() {
    if (this.signalRService && this.signalRService.mxChipData) {
      this.signalRSubscription = this.signalRService.mxChipData.subscribe((response: any) => {
        const signalRresponse = JSON.parse(response) as IopsignalRresponse;
        console.log('signalResponse', signalRresponse);

        // if (signalRresponse && Number(signalRresponse.rtp) !== 1) {
        //   return;
        // }
        // updates the flag once packet received
        if (signalRresponse) {
          this.dataReceived = true;
        }
        // split the 'd' key  and calls the verifyFirmware
        if (signalRresponse.d) {
          if (signalRresponse.d !== this.device.signalRresponse.d) {
            this.verifyFirmware(signalRresponse.d);
          }
        }
        // if error code > 0 and is different from the previous packet. update the log
        if (signalRresponse.err > 0 && this.device.signalRresponse.err !== signalRresponse.err) {
          this.updateErrorLogs(signalRresponse);
        }

        if (signalRresponse.err > 0 && this.device.signalRresponse.err === signalRresponse.err) {
          this.signalRerrorLogs[this.signalRerrorLogs.length - 1]['timestamp'] = DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts);
          // this.signalRerrorLogs.unshift(
          //   {
          //     errorCount: signalRresponse.err,
          //     timestamp: DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
          //     label: this.DecimalToBinary(signalRresponse.err)
          //   });
        }

        this.device.signalRresponse = new IopsignalRresponse(
          signalRresponse.id,
          DateUtils.getYYYY(signalRresponse.ts) < '2000' ? new Date().toISOString() : DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
          signalRresponse.cht,
          signalRresponse.chs,
          signalRresponse.ctt,
          signalRresponse.err,
          signalRresponse.d,
          signalRresponse.cdt,
          signalRresponse.clm
        );
      });
    }
  }

  // private setupSignalR() {
  //   // const device = 'zenath-truck21';
  //   const device = this.device.device_name_method;

  //   this.connection.start().then((c) => {
  //     //console.log('connection', c);
  //     this.connection.invoke('register', device)
  //       .catch((err: any) => console.warn(device + ' Failed to invoke. Error occurred. Error:' + err));

  //     const newMessage = new BroadcastEventListener<any>('newMessage');
  //     // register the listener
  //     this.connection.listen(newMessage); // subscribe to event

  //     this.subscription = newMessage.subscribe((response: string) => {
  //       console.log('signalr', response);
  //       const signalRresponse = JSON.parse(response) as IopsignalRresponse;

  //       // updates the flag once packet received
  //       if (signalRresponse) {
  //         this.dataReceived = true;
  //       }
  //       // split the 'd' key  and calls the verifyFirmware
  //       if (signalRresponse.d) {
  //         if (signalRresponse.d !== this.device.signalRresponse.d) {
  //           this.verifyFirmware(signalRresponse.d);
  //         }
  //       }
  //       // if error code > 0 and is different from the previous packet. update the log
  //       if (signalRresponse.err > 0 && this.device.signalRresponse.err !== signalRresponse.err) {
  //         this.updateErrorLogs(signalRresponse);
  //       }

  //       if (signalRresponse.err > 0 && this.device.signalRresponse.err === signalRresponse.err) {
  //         this.signalRerrorLogs[this.signalRerrorLogs.length - 1]['timestamp'] = DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts);
  //         // this.signalRerrorLogs.unshift(
  //         //   {
  //         //     errorCount: signalRresponse.err,
  //         //     timestamp: DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
  //         //     label: this.DecimalToBinary(signalRresponse.err)
  //         //   });
  //       }

  //       this.device.signalRresponse = new IopsignalRresponse(
  //         signalRresponse.id,
  //         DateUtils.getYYYY(signalRresponse.ts) < '2000' ? new Date().toISOString() : DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
  //         signalRresponse.cht,
  //         signalRresponse.chs,
  //         signalRresponse.ctt,
  //         signalRresponse.err,
  //         signalRresponse.d,
  //         signalRresponse.cdt,
  //         signalRresponse.clm
  //       );

  //     });
  //     // this.otherCalculations();
  //   });

  // }

  /***
   * Gets called when the user presses the refresh button on tabs.
   * Calls the respective function depending on the current value of activeTab
   */
  public refreshCalls() {
    switch (this.activeTab) {
      case 1:
        this.getUsageStats();
        break;
      case 2:
        this.getErrorLogs();
        break;
    }
  }

  /***
   * Gets Error logs for device.
   * days in params indicate the time span for fetching errors
   * filter out errors with error code <= 0
   */
  private getErrorLogs() {
    this.deviceService.getErrorLogs({ entity_id: this.entityId, days: 0 })
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          console.log('single heater errors', apiResponse);
          if (apiResponse.status === HttpStatusCodeEnum.Success) {

            this.context.errorLogs = apiResponse.response
              .filter(item => item.inactive_score > 0)
              .map((item) => {

                return {
                  label: parseInt(item.inactive_score) == 404 ? 'Waterheater not found.' : this.context.DecimalToBinary(parseInt(item.inactive_score)),
                  errorCount: parseInt(item.inactive_score),
                  timestamp: item.err_datetime
                };
              });
          } else {
            // console.error(apiResponse.message);
          }
        }
      }(this, this.errorLoader)
      );
  }

  /***
   *
   * @param d: 0.0.0,2.0.5,8/1/2023,-56,7 (from signalR response)
   * Hardware Version at first index
   * Firmware Version after First comma
   * Identity Expiry after 2nd comma
   * calls setupMetaInfo function to update software & hardware version
   */
  private verifyFirmware(d?) {
    if (!isNullOrUndefined(d)) {
      const version = d.split(',');
      this.showSignals = version[0] > '6.2.2';
      this.hardwareVersion = version[0];
      this.softwareVersion = version[1];
      this.identityExpiry = version[2];
      this.signalsStrength = version[3];
      this.setupMetaInfo();
    }
  }

  /***
   *
   * @param signalRresponse: current packet
   */
  private updateErrorLogs(signalRresponse) {
    // console.log('update error',DeviceErrorEnum[signalRresponse.err]);
    console.log('updateErrorLogs()= ', signalRresponse);
    this.signalRerrorLogs.unshift(
      {
        errorCount: parseInt(signalRresponse.err),
        timestamp: DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
        // label: parseInt(item.inactive_score) == 404? 'Waterheater not found.' : this.context.DecimalToBinary(parseInt(item.inactive_score)),
        label: parseInt(signalRresponse.err) == 404 ? 'Waterheater not found.' : this.DecimalToBinary(parseInt(signalRresponse.err))
      });

    this.signalRerrorLogs = [...this.signalRerrorLogs];

  }

  getDensityData(event, initial = false) {
    this.densityDataLoader = true;
    let dateRange;
    if (initial) {
      dateRange = event;
    } else {
      dateRange = event[0];
    }

    // const type = event[1];
    const isDateRangeInSameDay = isSameDay(
      new Date(dateRange[0]),
      new Date(dateRange[1])
    );

    // const start_date = this.datePipe.transform(dateRange[0], 'y-M-d');
    // const end_date = this.datePipe.transform(dateRange[1], 'y-M-d');

    const start_date = DateUtils.formateUtcDateTimeString(dateRange[0]);
    const end_date = DateUtils.formateUtcDateTimeString(dateRange[1]);

    this.densityData = [];

    const params = {
      entity_id: this.entityId,
      show_density_reporting: true,
      start_date: start_date,
      end_date: end_date,
    };

    if (event[2] == 'month')
      params['end_date'] = DateUtils.formateUtcDateTimeString(new Date().toUTCString());//DateUtils.formatDate(new Date, 'YYYY-MM-DD');

    this.deviceService.getDensityReporting(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // doc
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {

          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            const response = apiResponse.response;
            console.log('densityREPORTING= ', response);

            if (response) {
              this.context.densityData = this.context.filterPieGraphResponseData(response, isDateRangeInSameDay, dateRange[0]);
            } else {
              this.context.densityData = [];
            }

            // if (start_date == end_date)
            //   this.context.densityData = response.filter(function (e) {
            //     return new Date(e.new_start_dt).getDate() == new Date(start_date).getDate();
            //   });
            // else {
            //   this.context.densityData = response;
            // }

            // response.filter(
            //   x =>{
            //     new Date(x.new_start_dt).getDate() == new Date(start_date).getDate()
            //   }
            // );
            this.context.densityDataLoader = false;
          } else {
            // console.error(apiResponse.message);
          }
          if (initial) {
            this.context.todayStats.events_created = this.context.densityData.length;
          }
        }
      }(this)
      );
  }


  /***
   * unsubscribe from the signalR subscription
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // if (this.connection) {
    //   this.connection.stop();
    // }

    if (this.signalRSubscription) {
      this.signalRService.close();
      this.signalRSubscription.unsubscribe();
    }
  }

  DecimalToBinary(dec) {
    // console.log((dec >>> 0).toString(2));
    const binary = (dec >>> 0).toString(2);
    const reversed_binary = binary.split('').reverse().join('');
    var err = "";
    var first = true;
    for (var i = 0; i < reversed_binary.length; i++) {
      if (parseInt(reversed_binary.charAt(i)) == 1) {
        var err_bit = Power[i];
        if (first == true) {
          err = DeviceErrorEnum[Math.pow(2, i)];
          first = false;
        }
        else {
          err = err + " & " + DeviceErrorEnum[Math.pow(2, i)];
        }
      }
    }
    return err;
  }

  // filter density reporting data because we are getting different dates data we have fil
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
    return filteredRes;
  }
}
