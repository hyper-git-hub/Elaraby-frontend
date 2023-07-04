import 'rxjs/add/operator/do';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpEvent } from '@angular/common/http';
import {Router} from '@angular/router';

export class TimingInterceptor implements HttpInterceptor {
  constructor(private router: Router) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    console.log(req);
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        }
      }, err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          localStorage.removeItem('user');
          this.router.navigateByUrl('/login');
        }
      });
  }
}
