import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../app.config';
import {ApiResponse, ApiResponseWithHttpStatus} from '../model/api.response';
import {User} from '../model/user';

@Injectable()
export class UserService {

  constructor(public http: HttpClient) {
  }

  /**
   * Login the user
   * @param user
   */
  login(user: User): Observable<ApiResponseWithHttpStatus<User>> {
    const url = `${AppConfig.URL}/api/users/login/`;
    return this.http.post<ApiResponseWithHttpStatus<User>>(url, user);
  }

  /**
   * Retrieves user data
   * @param params
   */
  getUserData(params?: any): Observable<ApiResponseWithHttpStatus<any>> {
    const url = `${AppConfig.URL}/api/users/get_user_profile`;
    return this.http.get<ApiResponseWithHttpStatus<any>>(url, {params: params});
  }

  /**
   * modify user detais
   * @param params
   */
  modifyUserData(params) {
    const url = `${AppConfig.URL}/api/users/modify_user_details`;
    return this.http.patch(url, params);
  }

  /**
   * Resets user password & token
   * @param params
   */
  forgotPasword(params) {
    const url = `${AppConfig.URL}/api/users/regenerate_reset_token`;
    return this.http.patch(url, params);
  }

  verifyToken(params) {
    const url = `${AppConfig.URL}/api/users/verfiy_user_token`;
    return this.http.patch(url, params);
  }

  /**
   * Resets current user password
   * @param params
   */
  resetPassword(params) {
    const url = `${AppConfig.URL}/api/users/reset_user_password_token`;
    return this.http.patch(url, params);
  }

  /**
   * Invite/ add new user tot he system
   * @param params: user object to save
   */
  addNewUser(params) {
    const url = `${AppConfig.URL}/api/users/user_sign_up_invitation_manager`;
    return this.http.post(url, params);
  }

  /**
   * get Users listing
   * @param params
   */
  getUsers(params?) {
    const url = `${AppConfig.URL}/api/users/users_details_list`;
    return this.http.get<ApiResponseWithHttpStatus<any>>(url, {params: params});
  }

  getRoles(params?) {
    const url = `${AppConfig.URL}/api/users/get_roles`;
    return this.http.get<ApiResponseWithHttpStatus<any>>(url, {params: params});
  }

  getUserDropdown(params?) {
    const url = `${AppConfig.URL}/api/users/get_users`;
    return this.http.get<ApiResponseWithHttpStatus<any>>(url, {params: params});
  }

  /**
   * delete users from the system
   * @param params
   */
  deleteUsers(params?) {
    const url = `${AppConfig.URL}/api/users/delete_user/`;
    return this.http.patch(url, params);
  }


}
