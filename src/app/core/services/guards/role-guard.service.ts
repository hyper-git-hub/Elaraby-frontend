import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService, private _location: Location) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.getUser()['email'] === 'productionline@elaraby.com') {
      this.router.navigate(['/iop/qr-generator']);
      return false;
    }
    return true;
  }
}
