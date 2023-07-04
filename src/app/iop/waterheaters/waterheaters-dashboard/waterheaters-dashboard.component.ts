import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { subHours } from 'date-fns';
import { DatatableService } from '../../../shared/services/datatable.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../../shared/services/form.service';
import { PercentageDifference } from '../../../core/utils/percentageDifference';
import { AppLoader } from '../../../core/utils/app-loader';
import { DateUtils } from '../../../core/utils/date.utils';
import { IopsignalRresponse } from '../../model/iopsignalRresponse';
import { IoPDeviceTypesEnum } from '../../model/IopDeviceEnum';
import { DeviceStateEnum } from '../../model/device-state.enum';
import { DeviceErrorEnum, Power } from '../../model/device-error.enum';
import { HttpController } from '../../../core/interceptors/loading-controller';
import { Subscription } from 'rxjs/Subscription';
import { HttpStatusCodeEnum } from '../../../core/enum/HttpStatusCodeEnum';
import { WaterheaterService } from '../../services/waterheater.service';
import { ApiResponse, ApiResponseWithHttpStatus, ApiResponseWithRemainingFlag } from '../../../core/model/api.response';
import { GotoPageService } from '../../../shared/services/goto-page.service';
import { EntityStatusEnum, EntityType } from '../../../core/enum/entity-type.enum';
import { SwalService } from '../../../core/services/swal.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable/release/utils';
import { SignalRresponse } from '../../../../app/core/model/signalRresponse';
import { AgmMap } from '@agm/core';
import { DurationEnum } from '../../../core/constants';
import { element } from 'protractor';
import { SignalRService } from '../../../core/services/signal-r.service';

@Component({
  selector: 'app-waterheaters-dashboard',
  templateUrl: './waterheaters-dashboard.component.html',
  styleUrls: ['./waterheaters-dashboard.component.css'],
  providers: [SignalRService]
})
export class WaterheatersDashboardComponent implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {

  constructor(private route: ActivatedRoute,
    public datatableService: DatatableService,
    public gotoPage: GotoPageService,
    public formService: FormService,
    public swalService: SwalService,
    private signalRService: SignalRService,
    private deviceService: WaterheaterService) {

    // for signal R connection
    // this.connection = this.route.snapshot.data['connection'];
    // this.connection.status.subscribe((s) => console.warn('lala', s.name));
  }

  @ViewChild('AgmMap') agmMap: AgmMap;

  items = [{ label: 'Water Heaters' }];
  home = { label: 'Dashboard', url: '/iop' };

  DeviceStateEnum = DeviceStateEnum;
  searchText = '';
  water_index_a;
  water_index_b;

  statisticsLoader = new AppLoader();
  deleteLoader = new AppLoader();
  listingLoader = new AppLoader();
  signalRSubscription = new Subscription;
  copySignalR: any;
  signalRstarted: any[] = [];

  // private connection: SignalRConnection;
  private subscription: Subscription;
  heaters = [];
  heaters_count: number;
  rows = [];
  private temp = [];

  currentPage = 1;

  latitude: number = 30.0444;
  longitude: number = 31.2357;
  zoom: number = 10;
  markers = [];

  filter = [
    { label: 'Today', value: 0 }, { label: 'This Week', value: 7 }, { label: 'This Month', value: 30 }
  ];
  selectedError = 0;
  selectedSold = 0;
  selectedUsage = 0;
  selectedErrorsAll = 0;

  showMap = true;


  mostErrorDevice: any = {};
  mostSoldDevice: any = {};
  avgUsageDevice: any = { current_value: 0 };
  mostErrorLoader = new AppLoader();
  mostSoldLoader = new AppLoader();
  avgUsageLoader = new AppLoader();
  errorLoader = new AppLoader();
  avgErrorLoader = new AppLoader();
  avgErrors: any = { this_week: 0 };

  errorLogs = [];
  summary = { onlineHeaters: 0, offlineHeaters: 0, totalHeaters: 0 };


  modelListing = [];
  selectedModel = 'all';

  optimizedCall;
  index_a = 0;
  index_b = 10;

  signalRerrorLogs = [];

  @ViewChild('gmap') gmapElement: any;
  csvRows = [];

  csvCols = [
    { field: 'created_datetime', header: 'Created Datetime', time: true, format: 'medium' },
    { header: 'Name', field: 'name' },
    { header: 'ID', field: 'device_name_method' },
    { header: 'Model', field: 'leased_owned_name' },
    { header: 'Type', field: 'type' },
    { header: 'Capacity', field: 'volume_capacity' },
    { header: 'Classification', field: 'past_club' },
    { header: 'Frequency', field: 'cnic' },
    { header: 'Record Status', field: 'status_label' },
    { header: 'Identity Expiry', field: 'identity_expiry' },
    { header: 'Firmware Version', field: 'software_version' },
    { header: 'Hardware Version', field: 'hardware_version' },
    { header: 'Flange Temperature', field: 'signalRresponse.cht' }, //cht
    { header: 'Display Temperature', field: 'signalRresponse.cdt' }, //cdt
    { header: 'Desired Temperature', field: 'signalRresponse.ctt' }, //ctt
    { header: 'Current State', field: 'chss' },
    { header: 'Status', field: 'online_status' }
  ];
  selectedRows: any = [];

  icon = {
    url: '../../../assets/images/icon-map-water-heater.png',
    scaledSize: {
      width: 40,
      height: 50
    }
  };

  ngOnInit() {
    this.getListing();
    this.signalRService.init()
  }

  ngAfterViewInit() {
    // console.log(this.agmMap);
    this.agmMap.mapReady.subscribe(map => {
      if (this.markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        for (const mm of this.markers) {
          bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
        }
        map.fitBounds(bounds);
      }
    });
  }



  ngAfterContentInit(): void {
    this.errorDropdownChanged({ value: this.selectedError });
    this.mostSoldModel({ value: this.selectedSold });
    this.usageDropdownChanged({ value: this.selectedUsage });
    this.avrageErrorsDropdownChanged({ value: this.selectedErrorsAll });
    this.getErrorLogs();
  }

    //SignalR with Azure Functions
    setupSignalR() {
      if (this.signalRService && this.signalRService.mxChipData) {
        this.signalRSubscription = this.signalRService.mxChipData.subscribe((response: any) => {
          const signalRresponse = JSON.parse(response) as IopsignalRresponse;
          console.log('signalResponse', signalRresponse);
  
          // if (signalRresponse && Number(signalRresponse.rtp) !== 1) {
          //   return;
          // }

          
  
          for (let i = 0; i < this.heaters.length; i++) {
            if (this.heaters[i].device_name_method === signalRresponse.id) {
              // this.heaters[i]['online_status'] = true;
  
              if (signalRresponse.err > 0 && this.heaters[i].signalRresponse.err !== signalRresponse.err) {
                // const packet = '{ "err":"1" , "ts":"2/4/2020 6:30:11"}';
                // const signalRresponse = JSON.parse(packet) as IopsignalRresponse;
  
                const errors = signalRresponse.err.split(',');
                let label = '';
  
                if (errors.length > 1) {
                  for (var j = 0; j < errors.length; j++) {
                    if (i == 0) {
                      label = label + DeviceErrorEnum[errors[j]];
                    }
                    else {
                      label = label + " & " + DeviceErrorEnum[errors[j]];
                    }
                  }
                } else {
                  label = DeviceErrorEnum[errors[0]];
                }
  
  
                this.signalRerrorLogs.unshift({
                  // label: this.DecimalToBinary(signalRresponse.err),
                  label: parseInt(signalRresponse.err) == 404 ? 'Waterheater not found.' : this.DecimalToBinary(parseInt(signalRresponse.err)),
                  errorCount: signalRresponse.err,
                  timestamp: DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
                  model: this.heaters[i].leased_owned_name,
                  device: this.heaters[i].name,
                  device_id: this.heaters[i].id
                });
  
                this.signalRerrorLogs = this.signalRerrorLogs.reverse();
  
                this.signalRerrorLogs = [...this.signalRerrorLogs];
              }
  
              if (signalRresponse.err > 0 && this.heaters[i].signalRresponse.err === signalRresponse.err) {
                this.signalRerrorLogs[this.signalRerrorLogs.length - 1]['timestamp'] = DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts);
  
              }
  
              // console.error(signalRresponse.id);
              // console.log(this.heaters[i]);
  
              this.heaters[i].signalRresponse = new IopsignalRresponse(
                signalRresponse.id,
                DateUtils.getYYYY(signalRresponse.ts) < '2000' ? new Date().toISOString() : DateUtils.formatToUtc(signalRresponse.ts),
                // signalRresponse.ts,
                signalRresponse.cht,
                signalRresponse.chs,
                signalRresponse.ctt,
                signalRresponse.err,
                signalRresponse.d,
                signalRresponse.cdt,
                signalRresponse.clm
              );
  
              this.splitDebugKey(this.heaters[i].signalRresponse.d, i);
              // const splittedD = this.heaters[i].signalRresponse.d.split(',');
              // this.heaters[i]['software_version'] = splittedD[1];
              // this.heaters[i]['hardware_version'] = splittedD[0];
              // this.heaters[i]['identity_expiry'] = splittedD[2];
  
              this.heaters = [...this.heaters];
              // this.temp =JSON.parse(JSON.stringify( this.heaters ));
              // console.log("online status(this.temp)(this.summary)- ", this.temp, this.summary);
              // this.summary.onlineHeaters = this.temp.filter(item => item['online_status']).length;
              this.summary.offlineHeaters = this.summary.totalHeaters - this.summary.onlineHeaters;
  
  
              this.csvRows = this.heaters
              // console.log("this.context.csvRows= ", this.csvRows);
  
              for (let i = 0; i < this.csvRows.length; i++) {
                // console.log("this.csvRows[i].signalRresponse.chs== ", this.csvRows[i].signalRresponse.chs);
                this.csvRows[i].chss = DeviceStateEnum[this.csvRows[i].signalRresponse.chs];
              }
  
            }
          }
        });
      }
    }


  // private setupSignalR() {
  //   this.connection.start().then((c) => {

  //     this.rows.forEach((device, i) => {
  //       // this.rows['online_status'] = false;
  //       this.setupSignalRresponse(i);
  //       this.connection.invoke('register', device.device_name_method)
  //         .catch((err: any) => console.warn(device.device_name_method + ' Failed to invoke. Error occurred. Error:' + err));
  //     });


  //     const newMessage = new BroadcastEventListener<any>('newMessage');
  //     // register the listener
  //     this.connection.listen(newMessage);
  //     // subscribe to event
  //     this.subscription = newMessage.subscribe((response: string) => {
  //       console.log('signalRresponse', response);

  //       const signalRresponse = JSON.parse(response) as IopsignalRresponse;
  //       for (let i = 0; i < this.heaters.length; i++) {
  //         if (this.heaters[i].device_name_method === signalRresponse.id) {
  //           // this.heaters[i]['online_status'] = true;

  //           if (signalRresponse.err > 0 && this.heaters[i].signalRresponse.err !== signalRresponse.err) {
  //             // const packet = '{ "err":"1" , "ts":"2/4/2020 6:30:11"}';
  //             // const signalRresponse = JSON.parse(packet) as IopsignalRresponse;

  //             const errors = signalRresponse.err.split(',');
  //             let label = '';

  //             if (errors.length > 1) {
  //               for (var j = 0; j < errors.length; j++) {
  //                 if (i == 0) {
  //                   label = label + DeviceErrorEnum[errors[j]];
  //                 }
  //                 else {
  //                   label = label + " & " + DeviceErrorEnum[errors[j]];
  //                 }
  //               }
  //             } else {
  //               label = DeviceErrorEnum[errors[0]];
  //             }


  //             this.signalRerrorLogs.unshift({
  //               // label: this.DecimalToBinary(signalRresponse.err),
  //               label: parseInt(signalRresponse.err) == 404 ? 'Waterheater not found.' : this.DecimalToBinary(parseInt(signalRresponse.err)),
  //               errorCount: signalRresponse.err,
  //               timestamp: DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts),
  //               model: this.heaters[i].leased_owned_name,
  //               device: this.heaters[i].name,
  //               device_id: this.heaters[i].id
  //             });

  //             this.signalRerrorLogs = this.signalRerrorLogs.reverse();

  //             this.signalRerrorLogs = [...this.signalRerrorLogs];
  //           }

  //           if (signalRresponse.err > 0 && this.heaters[i].signalRresponse.err === signalRresponse.err) {
  //             this.signalRerrorLogs[this.signalRerrorLogs.length - 1]['timestamp'] = DateUtils.getLocalYYYYMMDDHHmmss(signalRresponse.ts);

  //           }

  //           // console.error(signalRresponse.id);
  //           // console.log(this.heaters[i]);

  //           this.heaters[i].signalRresponse = new IopsignalRresponse(
  //             signalRresponse.id,
  //             DateUtils.getYYYY(signalRresponse.ts) < '2000' ? new Date().toISOString() : DateUtils.formatToUtc(signalRresponse.ts),
  //             // signalRresponse.ts,
  //             signalRresponse.cht,
  //             signalRresponse.chs,
  //             signalRresponse.ctt,
  //             signalRresponse.err,
  //             signalRresponse.d,
  //             signalRresponse.cdt,
  //             signalRresponse.clm
  //           );

  //           this.splitDebugKey(this.heaters[i].signalRresponse.d, i);
  //           // const splittedD = this.heaters[i].signalRresponse.d.split(',');
  //           // this.heaters[i]['software_version'] = splittedD[1];
  //           // this.heaters[i]['hardware_version'] = splittedD[0];
  //           // this.heaters[i]['identity_expiry'] = splittedD[2];

  //           this.heaters = [...this.heaters];
  //           // this.temp =JSON.parse(JSON.stringify( this.heaters ));
  //           console.log("online status(this.temp)(this.summary)- ", this.temp, this.summary);
  //           // this.summary.onlineHeaters = this.temp.filter(item => item['online_status']).length;
  //           this.summary.offlineHeaters = this.summary.totalHeaters - this.summary.onlineHeaters;


  //           this.csvRows = this.heaters
  //           console.log("this.context.csvRows= ", this.csvRows);

  //           for (let i = 0; i < this.csvRows.length; i++) {
  //             // console.log("this.csvRows[i].signalRresponse.chs== ", this.csvRows[i].signalRresponse.chs);
  //             this.csvRows[i].chss = DeviceStateEnum[this.csvRows[i].signalRresponse.chs];
  //           }

  //         }
  //       }


  //     });
  //   });

  // }

  pageChanged(event: any): void {
    let end_index = event.page * this.index_b;
    let start_index = (end_index - this.index_b);
    this.currentPage = event.page;
    this.optimized_waterheaters_call(start_index, end_index, this.searchText);
  }


  splitDebugKey(debugKey, i) {
    let splittedD = [null, null, null];
    if (!isNullOrUndefined(debugKey)) {
      splittedD = debugKey.split(',');
    }
    this.heaters[i]['software_version'] = splittedD[1];
    this.heaters[i]['hardware_version'] = splittedD[0];
    this.heaters[i]['identity_expiry'] = splittedD[2];
  }

  /***
   *Calls the function for listing call,setting default starting & ending indexes
   */
  getListing() {
    this.temp = [];
    this.heaters = [];
    this.currentPage = 1;
    this.optimized_waterheaters_call(this.index_a, this.index_b, this.searchText);
  }

  /***
   * retrieves listing for waterheaters.This call is implemented in chunks/parts.
   * This is a recursive function that keeps on calling itself unless the remaining flag is sent false.
   * Te resulting array is appended in one array (heaters)
   * This method setup signalR response for each chunk and also creates markers for each chunk
   * @param index_a: starting index
   * @param index_b: ending index
   */

  optimized_waterheaters_call(index_a, index_b, searchText = '') {

    this.water_index_a = index_a;
    this.water_index_b = index_b;
    this.searchText = searchText;

    let results_remaining = false;
    this.optimizedCall =
      this.deviceService.getListing({
        device_type: IoPDeviceTypesEnum.WATER_HEATER,
        index_a: index_a,
        index_b: index_b,
        searchText: this.searchText
      })
        .subscribe(new class extends HttpController<ApiResponseWithRemainingFlag<any[]>> {
          onComplete(): void {
            this.context.csvRows = this.context.heaters;
            this.context.temp = this.context.heaters;

            // console.log("this.context.csvRows= ", this.context.csvRows);
            this.context.getModelsForDropdown();
            this.context.summary.offlineHeaters = this.context.summary.totalHeaters - this.context.summary.onlineHeaters;
          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);
          }

          onNext(apiResponse: any): void {  //ApiResponseWithRemainingFlag<any[]>
            // console.log('waterheaters', apiResponse);

            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              results_remaining = apiResponse.remaining;
              this.context.rows = apiResponse.response;
              // console.log(apiResponse.response);
              this.context.heaters_count = apiResponse.count;
              this.context.heaters = this.context.rows;
              this.context.temp = this.context.rows;
              this.context.summary.totalHeaters = apiResponse.count;
              this.context.summary.onlineHeaters = apiResponse.online_device_count;

              // this.context.heaters = [...this.context.rows, ...this.context.heaters];
              this.context.markers = [];
              for (let i = 0; i < this.context.rows.length; i++) {
                const latlng_string = this.context.rows[i]['source_latlong'];

                if (latlng_string != null && latlng_string != "") {
                  const latlng = {
                    lat: parseFloat(latlng_string.split(',')[0]),
                    lng: parseFloat(latlng_string.split(',')[1]), device_name: this.context.rows[i].name
                  };
                  this.context.markers.push(latlng);
                }
              }


              // this.context.markers.push({
              //   lat:33.7773919,
              //   lng:73.0500278
              // });
              // if (this.context.markers.length > 0) {
              //   const bounds = new google.maps.LatLngBounds();
              //   for (const mm of this.context.markers) {
              //     bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
              //   }
              //   this.context.agmMap.mapReady.fitBounds(bounds);
              // }
              // console.log((this.context.markers));
              // this.context.agmMap.mapReady.subscribe(map => {
              //   console.log('subscribe tp map');
              //   if (this.context.markers.length > 0) {
              //     const bounds = new google.maps.LatLngBounds();
              //     for (const mm of this.context.markers) {
              //       bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
              //     }
              //     map.fitBounds(bounds);
              //   }
              // });
              this.context.setupSignalR();
            } else {
              console.error(apiResponse.message);
            }
          }
        }(this, this.listingLoader)
        );
  }

  onMouseOver(infoWindow, gm) {
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
  }

  onMouseOut(infoWindow, gm) {
    infoWindow.close();
  }


  /***
   *
   * Gets called when a new packet is received.
   * Sets the packet to the param i (index) of heaters array
   * @param i, index of array
   */
  private setupSignalRresponse(i) {

    this.heaters[i].signalRresponse = new IopsignalRresponse(this.heaters[i].device_name_method,
      this.heaters[i].last_updated,
      null,
      1,
      null,
      0,
      this.heaters[i].registration,

      null,
      null
    );

    this.splitDebugKey(this.heaters[i].registration, i);
  }


  /**
   * Populates dropdown for waterheater models
   */

  private getModelsForDropdown() {
    this.formService.getOptionsDropdown({ option_key: 'water_heater_models' })
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.modelListing = apiResponse.response['option_values'];
            this.context.modelListing.push({ value: 'all', label: 'All' });
          } else {
            console.log(apiResponse.message);
          }
        }
      }(this)
      );
  }

  /***
   * Gets Error logs for device.
   * days in params indicate the time span for fetching errors
   * filter out errors with error code <= 0
   */
  public getErrorLogs() {
    const start_date = DateUtils.formatDate(new Date(), 'YYYY-MM-DD HH:MM:SS');
    const end_date = DateUtils.formatDate(subHours(start_date, 24), 'YYYY-MM-DD HH:MM:SS');
    const params = {
      // start_date: start_date,
      // end_date: end_date
      days: 0
    };
    this.deviceService.getErrorLogs(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            // console.log('errors', apiResponse.response);
            this.context.errorLogs = apiResponse.response
              .filter(item => item.inactive_score > 0)
              .map((item) => {
                return {

                  // label: this.context.DecimalToBinary(item.inactive_score),
                  label: parseInt(item.inactive_score) == 404 ? 'Waterheater not found.' : this.context.DecimalToBinary(parseInt(item.inactive_score)),
                  errorCount: item.inactive_score,
                  timestamp: item.err_datetime,
                  model: item.device__leased_owned__label,
                  device: item.device__name,
                  device_id: item.device_id,
                }
              });
          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.errorLoader)
      );
  }

  /***
   * Gets the device name with most error occurring within the given timespan.
   * Gets called when the user changes dropdown on card.
   * @param numberOfDays: 1, 7 or 30 depending upon the value selected from the dropdown (today, week or month)
   */
  private getMostErrorOcurring(numberOfDays) {
    const params = {
      sub_type: IoPDeviceTypesEnum.WATER_HEATER,
      days: numberOfDays
    };
    this.deviceService.getMostErrorOcurring(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            // console.log(apiResponse.response);
            this.context.mostErrorDevice = apiResponse.response;
            const percentage = PercentageDifference.calculateDifference(this.context.mostErrorDevice['last_error_prone_device_errors'], this.context.mostErrorDevice['error_prone_device_errors']);
            this.context.mostErrorDevice['percentage_diff_status'] = percentage > 0 ? 'more than last ' + DurationEnum[numberOfDays] : 'less than last ' + DurationEnum[numberOfDays];
            this.context.mostErrorDevice['percentage_diff'] = Math.abs(percentage);

          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.mostErrorLoader)
      );
  }


  /***
   * Gets the device name most sold within the given timespan.
   * Gets called when the user changes dropdown on card.
   * @param days: 1, 7 or 30 depending upon the value selected from the dropdown (today, week or month)
   */
  private getMostSoldDevice(days) {
    const params = {
      sub_type: IoPDeviceTypesEnum.WATER_HEATER,
      days: days
    };
    this.deviceService.getMostSold(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            // console.log('most sold', apiResponse.response);
            this.context.mostSoldDevice = apiResponse.response;
            const percentage = PercentageDifference.calculateDifference(this.context.mostSoldDevice['last_sold_model_count'], this.context.mostSoldDevice['sold_model_count']);
            this.context.mostSoldDevice['percentage_diff_status'] = percentage > 0 ? 'more than last ' + DurationEnum[days] : 'less than last ' + DurationEnum[days];
            this.context.mostSoldDevice['percentage_diff'] = Math.abs(percentage);
          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.mostSoldLoader)
      );
  }


  /***
   * Gets the average time of usage for all devices.
   * Gets called when the user changes dropdown on card.
   * @param numOfDays: 1, 7 or 30 depending upon the value selected from the dropdown (today, week or month)
   */
  private getAverageUsageDevice(numOfDays) {
    const params = {
      sub_type: IoPDeviceTypesEnum.WATER_HEATER,
      days: numOfDays
    };
    this.deviceService.averageUsage(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.avgUsageDevice = apiResponse.response;
            this.context.avgUsageDevice.current_value = this.context.avgUsageDevice.current_value / 60;
            // console.log('usage', apiResponse.response);
            const percentage = PercentageDifference.calculateDifference(this.context.avgUsageDevice.last_value, this.context.avgUsageDevice.current_value);
            this.context.avgUsageDevice['percentage_diff_status'] = percentage > 0 ? 'more than last ' + DurationEnum[numOfDays] : 'less than last ' + DurationEnum[numOfDays];
            // this.context.avgUsageDevice.current_value = DateUtils.getHoursFromMinutes(this.context.avgUsageDevice.current_value);
            // this.context.avgUsageDevice.current_value = DateUtils.getHoursFromMinutes(this.context.avgUsageDevice.current_value);
            this.context.avgUsageDevice['percentage_diff'] = Math.abs(percentage);
          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.avgUsageLoader)
      );
  }


  /***
   * Gets the average number of errors for all devices.
   * Gets called when the user changes dropdown on card.
   * @param numOfDays: 1, 7 or 30 depending upon the value selected from the dropdown (today, week or month)
   */
  private getAverageErrors(numOfDays) {
    const params = {
      sub_type: IoPDeviceTypesEnum.WATER_HEATER,
      days: numOfDays
    };
    this.deviceService.averageErrors(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any[]>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any[]>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.avgErrors = apiResponse.response;
            const percentage = PercentageDifference.calculateDifference(this.context.avgErrors.last_date, this.context.avgErrors.this_date);
            this.context.avgErrors['percentage_diff_status'] = percentage > 0 ? 'more than last ' + DurationEnum[numOfDays] : 'less than last ' + DurationEnum[numOfDays];
            this.context.avgErrors['percentage_diff'] = Math.abs(percentage);
          } else {
            console.error(apiResponse.message);
          }
        }
      }(this, this.avgErrorLoader)
      );
  }


  /**
   * Gets called when user changes the dropdown for Most Error Occurring card
   * @param event, the new dropdown value
   */
  errorDropdownChanged(event) {
    this.getMostErrorOcurring(event.value);

  }


  /**
   * Gets called when user changes the dropdown for Most Sold card
   * @param event, the new dropdown value
   */
  mostSoldModel(event) {
    this.getMostSoldDevice(event.value);

  }


  /**
   * Gets called when user changes the dropdown for Most Error Occurring card
   * @param event, the new dropdown value
   */
  usageDropdownChanged(event) {
    this.getAverageUsageDevice(event.value);

  }

  /**
   * Gets called when user changes the dropdown for Most Error Occurring card
   * @param event, the new dropdown value
   */
  avrageErrorsDropdownChanged(event) {
    this.getAverageErrors(event.value);

  }

  /**
   * Calls the datatable service search method,
   * Searches on leased_owned key / model type of the row
   * @param event: value selected from the modeltype dropdown
   */
  filterListing(event) {
    // console.log(event);
    if (event.value === 'all') {
      this.heaters = JSON.parse(JSON.stringify(this.temp));
    } else {
      // console.log(this.temp);
      // console.log(this.heaters);
      this.heaters = this.datatableService.updateFilter(event.value, this.temp, ['leased_owned']);
      // console.log(this.temp);
      // console.log("this.heaters= ", this.heaters);
    }

  }

  updateFilter(event) {
    // this.heaters = event;
    this.optimized_waterheaters_call(this.water_index_a, this.water_index_b, event.target.value);
  }


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


 

  /**
   * Get called when a row is selected
   * @param selected
   */
  onSelect({ selected }: any) {
    // console.log(selected);
    this.selectedRows = selected;
  }

  /***
   * Shows Interactive swal for deletion/inactive
   * Check relations for all the ids of selected rows.
   * If there are existing relations that will be affected by the deletion of this device,
   * this method will receive a BAD_REQUEST from server & a warning message,so that the user must know what his actions will be affecting.
   * Otherwise there will be a normal Success http askign the user either to delete or inactive the record
   *
   */

  async showSwalForMultiple() {

    const type = EntityType.WATERHEATERS;
    const arr = [];
    const id_list = [];
    let showInactive = false;
    let showActive = false;

    this.selectedRows.forEach(item => {
      arr.push(item.name);
      id_list.push(item.id);
    });

    if (id_list.length == 1) {
      showInactive = this.selectedRows[0].status !== EntityStatusEnum.Inactive;
      if (showInactive)
        showActive = false;
      else
        showActive = true;
    }
    else {
      showInactive = false;
      showActive = false;
    }

    if (showInactive) {
      const shouldDeleteOrInactive = await this.swalService.getMultipleDeleteSwal(arr, showInactive);
      if (shouldDeleteOrInactive) {
        const message = shouldDeleteOrInactive === EntityStatusEnum.Delete ? 'deleted' : 'marked inactive';
        this.deleteWaterheater(id_list, shouldDeleteOrInactive, 'Record has been ' + message + ' successfully');
      }
    }

    else {
      const shouldDeleteOrActive = await this.swalService.getMultipleDeleteSwalWithActive(arr, showActive);
      if (shouldDeleteOrActive) {
        const message = shouldDeleteOrActive === EntityStatusEnum.Delete ? 'deleted' : 'marked active';
        this.deleteWaterheater(id_list, shouldDeleteOrActive, 'Record has been ' + message + ' successfully');
      }
    }

    // const shouldDeleteOrInactive = await this.swalService.getMultipleDeleteSwal(arr, showInactive);
    // if (shouldDeleteOrInactive) {
    //   const message = shouldDeleteOrInactive === EntityStatusEnum.Delete ? 'deleted' : 'marked inactive';
    //   this.deleteWaterheater(id_list, shouldDeleteOrInactive, 'Record has been ' + message + ' successfully');
    // }


    // this.formService.deleteDataCheck({ 'id_list': id_list })
    //   .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
    //     onComplete(): void {
    //     }

    //     onError(errorMessage: string, err: any) {
    //       // do
    //       console.log(errorMessage);
    //       this.context.swalService.getErrorSwal(errorMessage);
    //     }

    //     async onNext(apiResponse: ApiResponseWithHttpStatus<any>) {
    //       console.log(apiResponse);
    //       if (apiResponse.status === HttpStatusCodeEnum.Success) {
    //         const shouldDeleteOrInactive = await this.context.swalService.getMultipleDeleteSwal(arr, showInactive);
    //         if (shouldDeleteOrInactive) {
    //           const message = shouldDeleteOrInactive === EntityStatusEnum.Delete ? 'deleted' : 'marked inactive';
    //           this.context.deleteWaterheater(id_list, shouldDeleteOrInactive, 'Record has been ' + message + ' successfully');
    //         }
    //       } else if (apiResponse.status === HttpStatusCodeEnum.Bad_Request) {
    //         console.log('400 status');
    //         const shouldDeleteOrInactive = await this.context.swalService.getMultipleDeleteSwal(arr, showInactive, apiResponse.message);
    //         if (shouldDeleteOrInactive) {
    //           const message = shouldDeleteOrInactive === EntityStatusEnum.Delete ? 'deleted' : 'marked inactive';
    //           this.context.deleteWaterheater(id_list, shouldDeleteOrInactive, 'Record has been ' + message + ' successfully');
    //         }
    //       } else {
    //         this.context.swalService.getErrorSwal(apiResponse.message);
    //       }
    //     }

    //   }(this)
    //   );

  }

  /***
   * Patch call for device deletion
   * @param truckId: ids to delete
   * @param actionType : Inactive or Delete
   * @param message: message to display in success swal
   */
  deleteWaterheater(truckId, actionType, message?) {
    const params = {};
    params['appliance_id'] = (truckId);
    params['status'] = actionType;
    this.formService.deleteData(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
          this.context.swalService.getErrorSwal(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
          console.log(apiResponse.status, '---', HttpStatusCodeEnum.Success);
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.swalService.getSuccessSwal(message);
            // this.context.inputValue = '';
            this.context.selectedRows = [];
            this.context.getListing();
          }
          else
            this.context.swalService.getErrorSwal('Heater(s) could not be deleted.');

        }

      }(this)
      );
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
}
