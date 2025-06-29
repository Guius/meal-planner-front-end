import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { AuthenticationService } from '../service/authentication.service';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular/standalone';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  /**
   * @param {Router} router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private logger: NGXLogger,
    private router: Router,
    private _authenticationService: AuthenticationService,
    private toastController: ToastController
  ) {}

  // Intercept any outgoing requests and receive their observables
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle response
    return next.handle(request).pipe(
      catchError((error) => {
        // Handle response if the exception is 401 and it is not from refresh endpoint, otherwise throw the error
        if (
          error instanceof HttpErrorResponse &&
          request.url !== `${environment.userApi}/auth/refresh` &&
          error.status === 401
        ) {
          this.logger.warn('401 detected');
          // Handle the 401 exception error
          return this.handleResponseError(request, next);
        }
        // Return error if not 401
        this.logger.warn(`${error} detected`);
        return throwError(error);
      })
    );
  }

  // Function which handles the 401 exception that has been intercepted
  handleResponseError(request: HttpRequest<any>, next: HttpHandler) {
    // Invalid access token error, refresh the access token and try the request again
    return this._authenticationService.refreshLogin().pipe(
      switchMap(() => {
        return next.handle(request);
      }),
      // Invalid refresh tokken error, log out the user and return to login page
      catchError(async (err) => {
        this.logger.error('catchError handleResponseError - ', err);
        this._authenticationService.logout();
        // this.showSessionEndToast();
        const toast = await this.toastController.create({
          message: 'Session expired. Please log in again!',
          duration: 1500,
          position: 'bottom',
        });

        await toast.present();
        return this.router.navigate(['/auth/login']);
      })
    );
  }
}
