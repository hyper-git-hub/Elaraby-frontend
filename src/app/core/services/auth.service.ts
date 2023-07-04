import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {User} from '../model/user';
import {iolModules} from '../model/module';
import {isNullOrUndefined} from 'util';
import {UserRoleEnum} from '../enum/user-role.enum';

@Injectable()
export class AuthService {

  constructor(private route: Router) {
  }

  /**
   * Saves the user in local storage against key 'user'
   * @param user : object
   */
  setUser(user: User): void {
    if (!isNullOrUndefined(user)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * getter for loggedIn user.
   */
  getUser(): User {
    return JSON.parse(localStorage.getItem('user')) as User;

  }

  /**
   * removes user obj from LocalStorage
   */
  unsetUser(): void {
    localStorage.removeItem('user');
  }

  /***
   * Checks if user is logged in by checking it's token
   */
  isLoggedIn(): boolean {
    if (localStorage.getItem('user')) {
      const user: User = JSON.parse(localStorage.getItem('user')) as User;
      if (user && user.token) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets token for current user
   */
  getToken(): string {
    const user: User = JSON.parse(localStorage.getItem('user')) as User;
    if (user && user.token) {
      return 'Token ' + user.token;
    }
    return null;
  }


  /***
   * Checks if the user has admin rights. This may be used to check special previleges granted to admin users only.
   */
  isAdminUser() {
    return this.getUser().user_role_id === UserRoleEnum.Admin;
  }

}
