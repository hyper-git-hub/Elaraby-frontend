import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../app.config';
import {ApiResponseWithHttpStatus} from '../../core/model/api.response';

/**
 * Servie being used in Dashbaord component
 */
@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  /**
   * gets the total number of devices in system
   */
  public getDevicesCount() {
    const url = `${AppConfig.URL}/iop/get_iop_devices_count/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url);
  }

  /**
   *
   * Gets the total number of units sold in this week, this month & this year
   */
  public getSoldStats() {
    const url = `${AppConfig.URL}/iop/get_iop_devices_sold_stats/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url);
  }

  /**
   *
   * @param params: start_date & end_date
   * Gets the units sold over the dateRange specified by the user
   */
  public getSoldGraph(params?) {
    const url = `${AppConfig.URL}/iop/get_device_sold_stats_graph/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }
  /**
   * Used for Pie chart used on dashboard component
   * Gets the name of devices & total count in system
   */

  public getCountsForCards() {
    const url = `${AppConfig.URL}/iop/get_iop_devices_count_cards/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url);
  }




}
