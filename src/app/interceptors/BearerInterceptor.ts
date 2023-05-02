import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, Observable, of, switchMap, throwError} from 'rxjs';
import {StorageService} from "../services/StorageService";
import {Router} from "@angular/router";
import {AuthService} from "../services/AuthService";
import {RefreshResponse} from "../models/RefreshResponse";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private storageService: StorageService, private router: Router, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.url.includes('refreshtoken')) {
      let jwtString = "Bearer " + this.storageService.getUser();

      req = req.clone({
        headers: req.headers.set('Authorization', jwtString)
      });

      return next.handle(req).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status == 401 && !req.url.includes("login")) {
            return this.handle401Error(req, next);
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.storageService.getRefreshToken();
    if (refreshToken !== null) {
      const refresh = refreshToken as string;
      return this.authService.refreshToken(refresh).pipe(
        switchMap((refreshResponse: RefreshResponse) => {
          this.storageService.saveRefreshSession(refreshResponse);
          const newToken = refreshResponse.accessToken;
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next.handle(request);
        }),
        catchError((error) => {
          if (error.status === 401) {
            this.authService.logout(refresh);
            this.router.navigate(['/login'], {
              queryParams: {
                error: 'sessionExpired',
                locationToRedirectAfterLogin: 'null'
              }
            });
            return of(error);
          } else {
            return throwError(error);
          }
        })
      );
    } else {
      this.storageService.clear()
      this.router.navigate(['/login'], {queryParams: {error: 'sessionExpired', locationToRedirectAfterLogin: 'null'}});
      return throwError("Refresh token not found");
    }
  }
}

export const
  httpInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
  ];
