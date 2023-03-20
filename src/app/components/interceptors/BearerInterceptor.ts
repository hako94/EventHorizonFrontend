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

    req = req.clone({
      headers: req.headers.set('Authorization', jwtString)
    });

    return next.handle(req);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
