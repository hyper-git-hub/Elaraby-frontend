import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth.service';


@Injectable()
export class AuthGuard implements CanLoad {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canLoad(route: Route) {
    if (this.authService.isLoggedIn()) {
      // if (this.authService.getUser().user_role_id == UserRoleEnum.User) {
      //   this.router.navigate(['unauthorized']);
      //   return false;
      // }
      return true;

    }

    console.log('not logged');

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
}
