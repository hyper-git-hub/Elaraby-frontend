import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {EntityStatusEnum} from '../../core/enum/entity-type.enum';
import {AuthService} from '../../core/services/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiResponseWithHttpStatus, ApiResponseWithRemainingFlag} from '../../core/model/api.response';
import {Observable} from 'rxjs/Observable';
import {DateUtils} from '../../core/utils/date.utils';
import {EntityResponse} from '../model/entity.response';

/**
 * Is Being Used in the Waterheaters Dashboard & Waterheater Detail Page
 */
@Injectable()
export class WaterheaterService {

  constructor(public http: HttpClient, private authService: AuthService) {  }

  /**
   * Not being Used currently
   */
  getWaterHeaters(params?) {
    const url = `${AppConfig.URL}/get_device_listing_by_type/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets usage of device
   * @param params: {entity_id: id for the device, data_type: usage hours , start_date: start date for the data, end_date: end date for the data};

   */
  getUsageGraph(params?) {
    const url = `${AppConfig.URL}/iop/graph_data_energy_usage//`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Retrieves single entity with the given id
   * @param id: id of the entity
   * @param params: optional for extra arguments (NOT BEING USED FOR NOW)
   */
  getEntity(id, params?: any): Observable<ApiResponseWithHttpStatus<EntityResponse>> {
    const url = `${AppConfig.URL}/iof/entities/${id}`;
    return this.http.get<ApiResponseWithHttpStatus<EntityResponse>>(url, {params: params});
  }

  /**
   * Fetches the data for energy consumption for a device
   * @param params: {device_id: id for device}
   */
  getEnergyConsumptionGraph(params?) {
    const url = `${AppConfig.URL}/iop/graph_data_energy_usage/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   *  Retrieves listing for entity. This call brings data in chunks.
   * @param params =  {
        device_type: IoPDeviceTypesEnum.WATER_HEATER,
        index_a: starting index,
        index_b: ending index
      }
   */
  getListing(params?) {
    const url = `${AppConfig.URL}/iop/get_device_listing_by_type/`;
    return this.http.get<ApiResponseWithRemainingFlag<any[]>>(url, {params: params});
  }

  /**
   * Gets usage trends for day (today & yesterday),week (current & last week), month (current & last) & year (current & last).
   * @param params: {entity_id:id of device}
   */
  getUsageStats(params?) {
    const url = `${AppConfig.URL}/iop/get_device_usage_stats/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }


  /**
   *  Gets the name & number of errors produced most by a device in the given number of days
   * @param params: number of days (for today 0, for week 7, for month 30)
   */
  getMostErrorOcurring(params?) {
    const url = `${AppConfig.URL}/iop/error_occuring_model/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   *  Gets the name of model & number of units sold most in the specified number of days
   * @param params: number of days (for today 0, for week 7, for month 30)
   */
  getMostSold(params?) {
    const url = `${AppConfig.URL}/iop/most_sold_model/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets the average usage by all devices of a particular type over the specified number of days
   * @param params =  {
      sub_type: IoPDeviceTypesEnum.WATER_HEATER,
      days: number of days (for today 0, for week 7, for month 30)
    }
   */
  averageUsage(params?) {
    const url = `${AppConfig.URL}/iop/avg_energy_all_devices/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets the average number of errors produced by all devices of a particular type over the specified number of days
   * @param params =  {
      sub_type: IoPDeviceTypesEnum.WATER_HEATER,
      days: number of days (for today 0, for week 7, for month 30)
    }
   */
  averageErrors(params?) {
    const url = `${AppConfig.URL}/iop/avg_errors_all_devices/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets the event details created on a device
   * @param params = {
      entity_id: id for the device,
      show_density_reporting: boolean flag,
      start_date: start_date,
      end_date: end_date,
      type_id= OPTIONAL, If the user wants to view only a specific typeof eventTypeDropdown ;
      user_id = OPTIONAL, If the user wants to view eventTypeDropdown created by a specific user only.
    };
   */
  getDensityReporting(params?) {
    const url = `${AppConfig.URL}/iop/get_density_reporting_graph/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets the different types of eventTypeDropdown created on a device
   * @param params: {entity_id: id for the device}
   */
  getEventsCreated(params?) {
    const url = `${AppConfig.URL}/iop/get_events_created_graph/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets the data for temperature trend observed on a device
   * @param params = {
      entity_id: id of device,
      start_date: start date
      end_date: end date
    }
   */
  getTemperatureGraph(params?) {
    const url = `${AppConfig.URL}/iop/graph_data_energy_usage/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  };

  /**
   * Gets the day to day stats for device, currently being energy_consumed, events_created, err_data: 0}
   * @param params = {entity_id: id for the entity}
   */
  getDeviceDayStats(params?) {
    const url = `${AppConfig.URL}/iop/get_device_day_stats/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  /**
   * Gets the errors produced by one / multiple device
   * @param params =  {
      start_date: start_date,
      end_date: end_date,
      days: 1 by default to get only the logs for today
      entity_id: if the user wants the errors for one device only. this will be the entity id of that device
    }
   */
  public getErrorLogs(params?) {
    const url = `${AppConfig.URL}/iop/get_device_error_logs/`;
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url, {params: params});
  }

  public  getUser(params?){
    const url = `${AppConfig.URL}/api/users/users_details/` + params['user_id']+ '/';
    return this.http.get<ApiResponseWithHttpStatus<any[]>>(url);
  }
}
