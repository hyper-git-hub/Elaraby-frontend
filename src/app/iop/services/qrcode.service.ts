import { Injectable } from '@angular/core';
import {EntityStatusEnum} from '../../core/enum/entity-type.enum';
import {AppConfig} from '../../app.config';
import {ApiResponseWithHttpStatus} from '../../core/model/api.response';
import {AuthService} from '../../core/services/auth.service';
import {HttpClient} from '@angular/common/http';


/**
 * Bein Used in the QR code generation component.
 */
@Injectable()
export class QrcodeService {

  constructor(private authService: AuthService, private http: HttpClient) { }


  /**
   * Generates QR for the given param.
   * @param params: contains ssid, password to be generated as QR & the other meta information like customer,module & status (active by default)
   * Makes a HTTP POST call & returns with the url of the generated PDF QR Report
   */
  generateQr(params: any) {
    params['customer'] = this.authService.getUser().customer.id;
    params['module'] = 1;
    params['modified_by'] = this.authService.getUser().customer.id;
    params['status'] =  EntityStatusEnum.Active;
    const url = `${AppConfig.URL + '/iop/generate_qr_code/'}`;
    return this.http.post (url, params);
  }

  /**
   * Svaes a QR code from the given params
   * @param params: contains ssid, password of the QR code to save
   * Makes a HTTP POST call & return  HTTP Status code
   */

  saveApplianceDetailsForQR(params) {
    const url = `${AppConfig.URL + '/iop/save_appliance_details_for_qr/'}`;
    return this.http.post (url, params);
  }

  /**
   * Gets all the QR codes saved in the backend
   * @param params: start_date & end_date
   * Makes a HTTP GET call to fetch all the QR codes over the given date range.
   * If no params are specified this method will return all the QR codes existing in DB.
   */
  getApplianceDetailsForQR(params?) {
    const url = `${AppConfig.URL + '/iop/get_appliance_details_for_qr/'}`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }


  /**
   * Deletes the given QR code
   * @param params: list of ids to delete
   * Makes a HTTP Patch call to delete the QR code specified in params
   */
  deleteApplianceDetailsForQR(params) {
    const url = `${AppConfig.URL + '/iop/deletion_qr_code/'}`;
    return this.http.patch(url, params);
  }


}
