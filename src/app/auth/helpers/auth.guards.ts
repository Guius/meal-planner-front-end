import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthenticationService } from '../service/authentication.service';
import { NGXLogger } from 'ngx-logger';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _logger: NGXLogger
  ) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this._authenticationService.authInfo;
    if (currentUser) {
      // check if route is restricted by role
      if (
        route.data['roles'] &&
        route.data['roles'].indexOf(currentUser.user.role) === -1
      ) {
        // role not authorised so redirect to not-authorized page
        this._router.navigate(['/pages/miscellaneous/not-authorized']);
        return false;
      }
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/pages/authentication/login-v2'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
