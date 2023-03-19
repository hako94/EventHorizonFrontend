import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import {StorageService} from "../../services/Storage";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private storageService : StorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let jwtString = "Bearer " + this.storageService.getUser();
    let xss = this.storageService.getCsrfKey() || '';

    req = req.clone({
      headers: req.headers.set('Authorization', jwtString)
    });
    req = req.clone({
      headers: req.headers.set('jwtCookie', jwtString)
    });
    req = req.clone({
      headers: req.headers.set('XSRF-TOKEN', xss)
    });
    req = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', xss)
    });
    req = req.clone({
      withCredentials: true
    });

    return next.handle(req);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
