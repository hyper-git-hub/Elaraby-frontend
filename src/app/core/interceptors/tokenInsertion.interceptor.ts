import {AuthService} from '../services/auth.service';
import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the service.
    const authHeader = this.auth.getToken();
    // const authHeader = '93a58040567a08af10e0554248ce31f0a653b36a';
    // let clientIP = localStorage.getItem('clientIP');
    // console.log(clientIP);
    // Clone the request to add the new header.
    let interceptedRequest = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
    if (authHeader) {
      interceptedRequest = req.clone({headers: req.headers.set('Authorization', authHeader).set('Content-Type', 'application/json').set('X-Content-Type-Options', 'nosniff')});
    }
    // Pass on the cloned request instead of the original request.
    return next.handle(interceptedRequest).do(event => {
      if (event instanceof HttpResponse) {
      }
    }, err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
       this.auth.unsetUser();
        this.router.navigateByUrl('/login');
      }
    });
  }
}
