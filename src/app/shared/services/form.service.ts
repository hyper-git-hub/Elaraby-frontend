import {Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {EntityStatusEnum} from '../../core/enum/entity-type.enum';
import {AuthService} from '../../core/services/auth.service';
import {ApiResponseWithHttpStatus} from '../../core/model/api.response';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {DropDownItem} from '../model/dropdown';
import {PrimengDropdownItem} from '../../core/model/primng-dropdown-item';
import {IoPScheduleType} from '../../iop/model/schedule-type.enum';

/**
 * Generic service for Forms functionalities. This contains methods to add, delete, modify & retrieve list of entities.
 */
@Injectable()
export class FormService {


  constructor(public http: HttpClient,
              private authService: AuthService) {
  }


  /**
   * Add new entity
   * @param params: form data to save
   * Makes a HTTP POST call & saves the data being sent as params
   */
  postData(params: any) {
    params['customer'] = this.authService.getUser().customer.id;
    params['module'] = 1;
    params['modified_by'] = this.authService.getUser().customer.id;
    params['status'] = EntityStatusEnum.Active;
    const url = `${AppConfig.URL + '/hypernet/entity/add_new_entity'}`;
    return this.http.post(url, params);
  }

  /**
   * Retrieves list of entities
   * @param params: type of entity to fetch
   */
  getEntities(params: any) {
    const url = `${AppConfig.URL}/iof/get_entities_list`;
    return this.http.get(url, {params: params});
  }

  /**
   * Update/ Modify an existing record
   * @param params: form data
   * Makes a HTTP Patch Call to update an existing record
   */
  patchData(params: any) {
    const url = `${AppConfig.URL + '/hypernet/entity/edit_entity'}`;
    return this.http.patch(url, params);
  }

  /**
   * This method can be used for records with file upload functionality
   * Update/ Modify an existing record
   * @param params: form data
   * Makes a HTTP Patch Call to update an existing record
   */
  patchDataWithUploadStatus(params: any) {
    const url = `${AppConfig.URL + '/hypernet/entity/edit_entity'}`;
    return this.http.patch(url, params, {
      reportProgress: true, observe: 'events'
    });
  }

  /**
   * Deletes a given record/s
   * @param params: {id_list: list of id/s to delete, status: to mark inactive | to delete permanently}
   * Makes an HTTP Patch call and deleted the given records
   */

  deleteData(params: any) {
    const url = `${AppConfig.URL + '/iop/delete_device_frontend/'}`;
    return this.http.post(url, params);
  }

 // peve delete call /hypernet/entity/delete_entity

  /**
   * CHecks for the relation of given device/s.
   * If there are existing assignments that will be affected if the entity is deleted this method will return a Bad Request.
   * Else there will be a normal success http status.
   * @param params: {'id_list': list of ids to delete}
   */
  deleteDataCheck(params: any) {
    const url = `${AppConfig.URL + '/hypernet/entity/check_entity_relations'}`;
    return this.http.get(url, {params: params});
  }



  /**
   * Gets options for dropdown, maps it according to the primng dropdown data format
   * @param params: {option_key: string key, type of dropdown data to fetch}
   */
  getOptionsDropdown(params?: any): Observable<ApiResponseWithHttpStatus<DropDownItem[]>> {
    const url = `${AppConfig.URL}/options/get_values/`;
    return this.http.get<ApiResponseWithHttpStatus<DropDownItem[]>>(url, {params: params}).map((item) => {
      item.response['option_values'].forEach((e, i) => {
        item.response['option_values'][i] = new PrimengDropdownItem(item.response['option_values'][i].id,
          item.response['option_values'][i].label);
      });
      return item;
    });

  }

  getIopEventOptionsDropdown(params?: any): Observable<ApiResponseWithHttpStatus<DropDownItem[]>> {
    const url = `${AppConfig.URL}/options/get_values/`;
    return this.http.get<ApiResponseWithHttpStatus<DropDownItem[]>>(url, {params: params}).map((item) => {
      item.response['option_values'].forEach((e, i) => {
        item.response['option_values'][i] = new PrimengDropdownItem(item.response['option_values'][i].id,
          IoPScheduleType[item.response['option_values'][i].id]);
      });
      return item;
    });

  }


}
