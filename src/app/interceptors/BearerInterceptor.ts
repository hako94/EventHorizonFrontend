import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {StorageService} from "../services/StorageService";
import {Router} from "@angular/router";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private storageService : StorageService, private router : Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let jwtString = "Bearer " + this.storageService.getUser();

    req = req.clone({
      headers: req.headers.set('Authorization', jwtString)
    });

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status == 401 && !req.url.includes("login")) {
          this.storageService.clear()
          this.router.navigate(['/login'], { queryParams: {error: 'sessionExpired', locationToRedirectAfterLogin: 'null'}});
        }
        return throwError(() => error);
      })
    );
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
