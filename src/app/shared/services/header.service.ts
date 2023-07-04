import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ApiResponse, ApiResponseWithHttpStatus} from '../../core/model/api.response';
import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/debounceTime';

/**
 * Deals with functionalities provided by the header
 */
@Injectable()
export class HeaderService {

  constructor(private http: HttpClient) {
  }


  /**
   *
   * @param key: lookup key for the app.config urls list
   * @param params : keyword to search
   */
  getSearch(key, params: any): Observable<ApiResponseWithHttpStatus<SearchResponse[]>> {
    const url = `${AppConfig.APIOptionsHandler(key)}`;
    return this.http.get<ApiResponseWithHttpStatus<SearchResponse[]>>(url, {params: params});
  }


  /**
   * NOT IN USE
   * Gets the count for notifications
   * @param params
   */
  getIoLNotificationCount(params?: any) {
    const url = `${AppConfig.URL}/hypernet/notifications/get_user_alerts_count`;
    return this.http.get(url, {params: params});
  }

  /**
   * Gets list of notifications from backend
   * @param key: lookup key for the app.config urls list
   * @param params: optional & empty for now
   */
  getIolNotifications(key, params?: any): Observable<ApiResponse<any>> {
    const url = `${AppConfig.APIOptionsHandler(key)}`;
    return this.http.get<ApiResponse<any>>(url, {params: params});
  }


}

/**
 * Sample response for search results returned by thee search service.
 */
export class SearchResponse {
  constructor(
    public id: number,
    public entity_type: string,
    public title: string,
  ) {
  }
}
