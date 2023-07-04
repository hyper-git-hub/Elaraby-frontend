import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppConfig } from '../../app.config';
import { AppLoader } from '../../core/utils/app-loader';
import { ConfirmationService, Message } from 'primeng/api';
import { FormService } from '../../shared/services/form.service';
import { isNullOrUndefined } from '@swimlane/ngx-datatable/release/utils';
import { DateUtils } from '../../core/utils/date.utils';
import { DatatableService } from '../../shared/services/datatable.service';
import { SwalService } from '../../core/services/swal.service';
import { HttpController } from '../../core/interceptors/loading-controller';
import { HttpStatusCodeEnum } from '../../core/enum/HttpStatusCodeEnum';
import { ApiResponse, ApiResponseWithHttpStatus } from '../../core/model/api.response';
import * as XLSX from 'xlsx';
import { QrcodeService } from '../services/qrcode.service';
import { excelFileType, QR_CODE_DEVICE_PASSWORD, QR_CODE_EXCEL_FILE_COLUMNS } from '../../core/constants';
import { EntityStatusEnum, EntityType } from '../../core/enum/entity-type.enum';
import { CustomValidators } from '../../core/utils/custom.validator';
import swal from 'sweetalert2';

@Component({
  selector: 'app-qr-generation-form',
  templateUrl: './qr-generation-form.component.html',
  styleUrls: ['./qr-generation-form.component.css']
})
export class QrGenerationFormComponent implements OnInit {

  qrForm: any;
  // holds the rows for table
  devices: any[] = [];
  // list of all qr codes, used for searching
  temp: any[] = [];
  appLoader = new AppLoader();
  generateReportLoader = new AppLoader();
  saveRecordLoader = new AppLoader();
  readFileLoader = new AppLoader();
  selectedRows: any[] = [];
  btn1Text = 'Generate QR';
  btn2Text = 'Save';
  deviceList = [];

  // data binding array to p-chips
  device_ids = [];
  inputValue = '';

  // 2D arrays for storing the col-row syntax of excel file
  data = [[], []];
  msgs: Message[];

  uploadedFiles: any[] = [];

  uploadLoader = new AppLoader();

  selectedFilter;
  selectedSecondaryFilter = null;
  filters = [
    { label: 'By Date', value: 'created_datetime' },
    { label: 'By Model', value: 'ssid' },
  ];
  dateDropdown = [
    { label: 'Asc', value: 'asc' },
    { label: 'Desc', value: 'desc' },
  ];

  modelDropdown = [
    { label: 'All', value: null },
    { label: '45l', value: '45' },
    { label: '55l', value: '55' },
    { label: '65l', value: '65' },
  ];
  loading = false;
  secondaryFilters = [];
  dateRange = [];


  @ViewChild('closeButtonForUploadForm') private closeButtonForUploadForm;


  constructor(public formBuilder: FormBuilder,
    private datatableService: DatatableService,
    private qrService: QrcodeService,
    private formService: FormService,
    private confirmationService: ConfirmationService,
    private swalService: SwalService) {
    this.qrForm = this.formBuilder.group({
      // device_id: ['', [Validators.required, CustomValidators.isAlphabetsAndNumbers]],
      password: [{ value: QR_CODE_DEVICE_PASSWORD }],
      ssid: ['', [Validators.required, CustomValidators.isAlphabetsAndNumbers, this.noWhitespaceValidator]]
    });//CustomValidators.Elaraby
  }

  @ViewChild('closeForm') private closeForm;

  ngOnInit() {
    this.clearForm();
    this.getDeviceDetails();
    this.secondaryFilters = this.dateDropdown;
  }

  public noWhitespaceValidator(control: FormControl) {
    debugger
    const isWhitespace = control.value.charAt(0) === ' '? true: false;
    const isValid = !isWhitespace;
    const ss = isValid ? null : { 'whitespace': true };
    return isValid ? null : { 'whitespace': true };
  }

  /**
   * Clears the form.
   * Resets the selected rows and the devices added previously.
   */
  clearForm() {
    this.qrForm.reset();
    this.device_ids = [];
    this.deviceList = [];
    this.selectedRows = [];
  }

  /**
   * removes all the files uploaded. Resets the arrays
   */
  resetUploadFileForm() {
    this.data = [];
    this.uploadedFiles = [];
  }

  /***
   * Gets called when the user uploads a file.
   * It validates the type of file. if xlsx, it will call another method to reead the file.
   * Else, It will reset the upload form, so that the user can upload a file again.
   * @param event: FileUplaod event, ontains the file/s uploaded by the user
   */

  onUpload(event) {
    this.readFileLoader.visibility = true;
    for (const file of event.files) {
      if (file.type.indexOf(excelFileType) > -1) {
        this.uploadedFiles.push(file);
        this.onFileChange1(event.files);
      } else {
        this.resetUploadFileForm();
      }
    }

  }

  /***
   *
   * @param files: File[]-> files uploaded by the user,
   *  Gets called when the user has uploaded a valid file.
   *  It will verify that there is a single file uploaded &&
   *  the format of file matches the format specified in the assets/docs/sample.xlsx
   *  error is thrown if file doesn't matches the criteria; else it will be read by FileReader.
   */
  onFileChange1(files) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(files);
    if (files.length !== 1) {
      throw new Error('Cannot use multiple files');
    } else {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        const isFileVerified = this.validateFile(this.data);
        this.readFileLoader.visibility = false;

        if (!isFileVerified) {
          this.uploadedFiles = [];
          this.swalService.getErrorSwal('Invalid File Format');
        }

      };
      reader.readAsBinaryString(files[0]);
    }
  }

  /***
   *
   * @param fileContentAsJSON: content of file uploaded by the user in JSON format
   * Search for the columns name specified in constants.ts file with the columns name in the uploaded file.
   * If the file contains any column which isn't present in the QR_CODE_EXCEL_FILE_COLUMNS array. This method will return false/
   */
  validateFile(fileContentAsJSON): boolean {
    let verified = false;

    fileContentAsJSON[2].forEach(item => {
      if (!isNullOrUndefined(item)) {
        verified = QR_CODE_EXCEL_FILE_COLUMNS.includes(item);
      }
    });
    return verified;
  }

  /***
   * Gets called after the file uploaded is verified & the user click on the submit button.
   * This method reads the file line by line, formats the data
   * and populates the deviceList array.
   * Verify that the file isn't empty, if true calls another method to save the content; else throws error.
   * NOTE: We are expecting a file exactly like the one in assets/docs/sample.xlsx. That is why the looping index is static.
   */
  submitFile() {
    if (this.data.length) {
      this.deviceList = [];
      //this.uploadLoader.visibility = true;

      // loops through the rows and concat the cell contents of each row with an '-'
      // for e.g. elaraby | wh | 45l : index1:index2:index3:index4:index5:index6 will become elaraby-wh-45l-index5index6
      console.log("this.data---", this.data);
      for (let row = 5; row < this.data.length; row++) {
        if (this.data[row].length) {
          let device_id = '';
          for (let col = 2; col < this.data[row].length; col++) {
            if (!isNullOrUndefined(this.data[row][col])) {
              /** the content of 5th column are like index1:index2:index3:index4:index5:index6
               * we have to split the string and concat the last 2 substrings. like index5index6
               */
              if (col === 5) {
                console.log("this.data[row][col]---", this.data[row][col]);
                console.log("typeof(this.data[row][col])---", typeof (this.data[row][col]));

                if (typeof (this.data[row][col]) == "number") {
                  this.swalService.getWarningSwal('File format not correct');
                  return;
                } else {
                  const splittedUp = this.data[row][col].split(':');
                  device_id += splittedUp[splittedUp.length - 2] + splittedUp[splittedUp.length - 1];
                }

              } else {
                device_id += this.data[row][col] + '-';
              }
            }
          }

          // password is hard-coded for now.
          this.deviceList.push({
            password: QR_CODE_DEVICE_PASSWORD,
            ssid: device_id,
          });

        }
      }

      console.log("this.deviceList--", this.deviceList);

      if (this.deviceList.length) {
        this.saveDevice();
      } else {
        this.uploadLoader.visibility = false;
        this.swalService.getWarningSwal('You have uploaded an empty file');
      }

    }
  }


  /**
   * @param event: the option selected by the user. This can be either By Date | By Model | null
   * Gets called when the user selects the sort-by dropdown
   * Populates the second Dropdown on the basis of the sort-by type selected by the user.
   * If the user clears the filter, table rows will be reset to the original value.
   */
  sortingDropdownChanged(event) {
    if (event === filters.SSID) {
      this.selectedSecondaryFilter = null;
      this.secondaryFilters = this.modelDropdown;
    } else if (event === filters.CREATED_DATETIME) {
      this.secondaryFilters = this.dateDropdown;
      this.selectedSecondaryFilter = 'desc';
    } else {
      this.devices = this.temp;
    }
  }

  /**
   * Gets called when the user selects the second dropdown
   * Calls the datatable service if the user has selected Sort By Model.
   * Else sort the rows according to the created_datetime field. (when the user has selected Sort By Date)
   */
  applySortingFilter() {
    if (this.selectedFilter === filters.CREATED_DATETIME) {
      this.loading = true;
      const rows = [...this.devices];
      rows.sort((a, b) => {
        return a[this.selectedFilter].localeCompare(b[this.selectedFilter]) * (this.selectedSecondaryFilter === 'desc' ? -1 : 1);
      });
      this.devices = rows;
      this.loading = false;
    } else {
      // this.devices = this.datatableService.myMultiFilter(this.temp, {ssid: this.selectedSecondaryFilter});
      this.devices = this.datatableService.updateFilter(this.selectedSecondaryFilter, this.temp, ['ssid']);
    }
  }

  /***
   * Gets called when the user searches by the input field.
   * Event emitter for the child component app-table-search
   * @param event: filtered row
   */
  updateFilter(event) {
    this.devices = event;
  }


  /***
   * If there is any error while uploading the file
   * @param event: error object
   */
  onError(event) {
    alert('there is an error');
  }

  /***
   * Gets called when the user removes an uploded file
   * @param event: file to be removed
   * Search for & removes the file from the uploaded file array.
   * Restes the data array.
   */
  removeUploadedFile(event) {
    const index = this.uploadedFiles.indexOf(event);
    if (index > -1) {
      this.uploadedFiles.splice(index);
      this.data = [];
    }
    this.readFileLoader.visibility = false;
  }

  /***
   * @param formValue:{ssid: value entered by the user on form}
   * Gets called when the user fills the form & clicks the Generate QR button on form.
   * This method verifies the form, populates the deviceList object & calls the method to generate QR
   */
  generateBtnClicked(formValue: object) {
    // form fields are filled (single value)
    if (this.qrForm.valid) {
      this.deviceList.push({
        password: QR_CODE_DEVICE_PASSWORD,
        ssid: formValue['ssid']
      },
      );
      this.generateQR();
    }  // user has entered multiple items
    else if (this.device_ids.length) {
      this.generateQR();
    } else {
      this.swalService.getWarningSwal('Please fill up the form');
    }
  }

  /**
   * Generates QR codes pdf.
   * @param obj: optional, only passed if the user generated QR for a single row by clicking on the shortcut buttons under ACTIONS column.
   * If no obj, it means the user has selected/entered new records for QR generation. Calls the saveQR method to save them as well.
   * Makes a HTTP  post call with the required params & open the pdf file which is sent by the server as response in new tab
   */
  generateQR(obj?): void {
    // push to the array
    if (obj) {
      // we have clone object to get shallow copy ,actully we don't want to modify original object
      let objCopy = { ...obj };
      objCopy.password = atob(objCopy.password);
      this.deviceList.push(objCopy);
    }
    const params = {
      appliances: this.deviceList
    };
    // UI perspective only
    this.swalService.showLoadingSwal();
    this.qrService.generateQr(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
          // User has entered new records so save them as well.
          if (isNullOrUndefined(obj)) {
            this.context.SaveBtnClicked(null, true);
          }
          // clears the form
          this.context.clearForm();
        }

        onError(errorMessage: string, err: any) {
          // do
          // this.context.enableSubmitButton();
          this.context.swalService.getErrorSwal(errorMessage);
          this.context.clearForm();

        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.swalService.getSuccessSwal(apiResponse.message);
            this.context.closeForm.nativeElement.click();
            // clears the selected rows, once report is generated
            this.context.selectedRows = [];
            window.open('https://' + apiResponse.response.file);
          } else {
            this.context.swalService.getWarningSwal(apiResponse.message);
          }
        }

      }(this, this.generateReportLoader)
      );

  }


  /***
   * Saves QR codes
   * @param formValue : {ssid: value entered by the user}
   * @param hasReportAlreadyGenerated: boolean flag which indicated whether the QR report has been generated or not.
   * Gets called when the user clicks on the Save QR button on the form or when the user generated a report and our system saves it automatically.
   *
   */
  SaveBtnClicked(formValue?, hasReportAlreadyGenerated = false) {
    if (!isNullOrUndefined(formValue)) {
      formValue['password'] = QR_CODE_DEVICE_PASSWORD;
    } // user has filled the form
    if (this.qrForm.valid && !isNullOrUndefined(formValue)) {
      this.deviceList.push(formValue);
      this.saveDevice();
    } else if (this.qrForm.dirty && this.device_ids.length && !hasReportAlreadyGenerated) {
      this.showConfirmationDialog();
    }
    //  report has been generated successfully, so save the device
    else {
      this.saveDevice();
    }
  }

  showConfirmationDialog(forSaveDialog = true) {
    this.confirmationService.confirm({
      message: 'You have unfinished changes. Proceeding will save only the previous record/s. Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'ion-android-warning',
      accept: () => {
        forSaveDialog ? this.saveDevice() : this.generateQR();
      },
      reject: () => {
      }
    });
  }

  /**
   * 'params for save', this.deviceList
   * Makes a HTTP post request which saves the entered qr codes. This method then refreshes the table.
   */
  saveDevice() {
    const params = { devices_list: this.deviceList };
    this.uploadLoader.visibility = true;

    this.qrService.saveApplianceDetailsForQR(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
          this.context.clearForm();
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log("inside onError()---", errorMessage);
          this.context.uploadLoader.visibility = false;
          this.context.swalService.getErrorSwal(errorMessage);
          this.context.closeButtonForUploadForm.nativeElement.click();
          this.context.clearForm();
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            // closes the form
            this.context.closeForm.nativeElement.click();
            this.context.data = [];
            this.context.uploadedFiles = [];
            this.context.closeButtonForUploadForm.nativeElement.click();
            this.context.uploadLoader.visibility = false;
            this.context.swalService.getSuccessSwal(apiResponse.message, 2000);

            this.context.getDeviceDetails();
          }
        }

      }(this, this.saveRecordLoader)
      );
  }


  /**
   * Gets called when the user selects the date filter. Calls the method to fetch listing filtered with start & end dates.
   * @param event: [[start_date, end_date], type]
   */
  getReport(event) {
    const dateRange = event[0];
    const start_date = DateUtils.getUtcDateTimeStart(dateRange[0]);
    const end_date = DateUtils.getUtcDateTimeEnd(dateRange[1]);
    this.dateRange = [start_date, end_date];
    this.selectedRows = [];
    this.getDeviceDetails(start_date, end_date);
  }

  /**
   * Gets the list of all the QRs codes generated.
   * @param start_date: filters for the creation date
   * @param end_date: filters for the creation date
   * Populates the table rows
   */
  getDeviceDetails(start_date?, end_date?) {
    let params = {};
    if (start_date && end_date) {
      params = {
        start_date: start_date, end_date: end_date
      };
    }
    this.qrService.getApplianceDetailsForQR(params)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<any>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
          this.context.swalService.getErrorSwal(errorMessage);
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<any>): void {
          if (apiResponse.status === HttpStatusCodeEnum.Success) {
            this.context.devices = apiResponse.response['devices'];
            this.context.temp = apiResponse.response['devices'];
          }
        }

      }(this, this.appLoader)
      );
  }

  /***
   * Appends the current formValue in array.
   * Populates the dataset for p-chips
   * @param formValue: current value of form
   * Gets called when the user enters something in form and clicks on 'Add More'
   */
  addMore(formValue) {
    this.device_ids.push(formValue['ssid']);
    this.deviceList.push({
      password: QR_CODE_DEVICE_PASSWORD,
      ssid: formValue['ssid']
    });
    this.qrForm.reset();
  }

  /**
   * Gets called when user selects multiple rows from the checkboxes
   * @param selected: selected rows
   */
  onSelect({ selected }) {
    this.selectedRows = selected;
  }

  /***
   * Gets called when the user selects multiple rows & clicks on 'generate QR for selected' button.
   * Populates the dataList array and calls the generateQR methid to generate QR.
   */
  generateQRforMultiple() {
    this.deviceList = this.selectedRows;
    this.generateQR(false);
  }


  onChange(event) {
    return false;
  }

  /**
   * Removes the element from p-chips
   * @param event: item to remove
   * Filters the deviceListArray & removes the pecific item.
   * Gets called when the user clicks on the cross icon on p-chip item.
   *
   */
  remove(event) {
    this.deviceList = this.deviceList.filter(function (el) {
      return el.ssid !== event.value;
    });
  }

  /***
   * Promots the user to specify what action to take with the selected rows. Whether to Cancel | Delete | Inactive.
   * Calls the deleteQRs method to make a HTTP call.
   * @param row: object to delete
   */
  async showSwalForMultiple(row?) {
    const id_list = [];

    if (row) {
      id_list.push(row.ssid);

    } else {
      this.selectedRows.forEach(item => {
        id_list.push(item.ssid);
      });
    }
    const shouldDelete = await this.swalService.getMultipleDeleteSwal(id_list, false);
    console.log(shouldDelete);
    if (shouldDelete) {
      this.deleteQRs(id_list, 'Record has been Deleted Successfully');
    }


  }

  /**
   *
   * @param truckId : list of ids to delete
   * @param message: message to displayed after successful operation
   */
  deleteQRs(truckId, message?) {
    const params = {};
    params['ssid_list'] = (truckId);
    this.qrService.deleteApplianceDetailsForQR(params)
      .subscribe(new class extends HttpController<ApiResponse<any>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
          this.context.swalService.getErrorSwal(errorMessage);
        }

        onNext(apiResponse: ApiResponse<any>): void {
          console.log(apiResponse);
          this.context.swalService.getSuccessSwal(message);
          this.context.selectedRows = [];
          this.context.getDeviceDetails();

        }

      }(this)
      );
  }
}

enum filters {
  SSID = 'ssid',
  CREATED_DATETIME = 'created_datetime'
}
