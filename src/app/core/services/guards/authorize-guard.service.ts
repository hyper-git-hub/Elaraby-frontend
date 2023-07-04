import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService, private _location: Location) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authService.getUser();
    if(user && user.user_role_name == 'Admin'){
        return true;
    }
    let url = this.router.url;
    
    this.router.navigate(['/iop/qr-generator'])
    return false;
  }
}
