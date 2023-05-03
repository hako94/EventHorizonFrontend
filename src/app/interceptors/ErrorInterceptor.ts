import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = ''; // Nachricht, die an den Nutzer angezeigt wird
          if (error.error instanceof ErrorEvent) {
            // Client-seitiger Fehler
            //errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-seitiger Fehler
            if (error.error.message) {
              errorMessage = `Fehler: ${error.error.message}`;
            }
            else {
              // errorMessage = `${error.status}: ${error.message}`;
            }
          }

          this.snackBar.open(errorMessage, 'OK', {
          duration: 5000,
          panelClass: ['mat-toolbar', 'mat-warn']
          });

          return throwError(error);
        })
      );
  }
}
