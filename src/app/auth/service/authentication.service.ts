import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';
import { AuthInfo, AuthUser } from '../models/authInfo';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _authInfo: AuthInfo | undefined;
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | undefined;
  public loginStateChange: BehaviorSubject<boolean>;

  /**
   *
   * @param {NGXLogger} logger
   */
  constructor(private logger: NGXLogger) {
    this.loginStateChange = new BehaviorSubject(this.loggedIn);
  }

  public get lastLoggedInAs(): string {
    const lastlogin = localStorage.getItem('lastLoggedInAs');

    if (!lastlogin) return '';

    return lastlogin;
  }

  public set lastLoggedInAs(value: string) {
    localStorage.setItem('lastLoggedInAs', value);
  }

  /**
   * The authInfo property shows the information which has been returned when the user
   * logged in, or refreshed their token
   */
  public get authInfo(): AuthInfo | null {
    const authInfoString = localStorage.getItem('authinfo');

    if (!authInfoString) return null;

    let userJson: Record<string, unknown>;
    let authInfoJson: Record<string, unknown>;

    try {
      userJson = JSON.parse(authInfoString).user;
      authInfoJson = JSON.parse(authInfoString);
    } catch (err) {
      throw new Error('Could not parse auth info string');
    }
    const instanceOfUser = plainToInstance(AuthUser, userJson);
    const instance = plainToInstance(AuthInfo, authInfoJson);

    const result = instance;
    result.user = instanceOfUser;

    this._authInfo = result;
    return result;
  }

  /** This method sets auth info.*/
  public set authInfo(value: AuthInfo | undefined) {
    if (!value) {
      localStorage.removeItem('authinfo');
      this.loginStateChange.next(false);
    } else {
      localStorage.setItem('authinfo', JSON.stringify(value));
      this.loginStateChange.next(true);
    }
    this._authInfo = value;
  }

  // Boolean which indicates if the user is logged in by checking if _authInfo is defined
  public get loggedIn(): boolean {
    if (!this._authInfo) {
      return false;
    } else {
      return true;
    }
  }

  // Boolean which indicates if the user is verified by checking if email_verified_date equals to 0 in the _authInfo
  public get verified(): boolean {
    if (!this._authInfo) {
      return false;
    }

    if (this._authInfo.user.email_verified_date === 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Description
   * -
   * - Uses the native fetch API to make a call to the login endpoint of the user api
   * - credentials set to 'include' indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers
   * - on success, the AuthInfo is set and a timer starts which refreshes the auth token periodically
   * @param {string} email
   * @param {string} password
   * @returns {Promise} a promise that resolves when login is complete
   */
  async login(email: string, password: string): Promise<void> {
    try {
      const response = await fetch(`${environment.userApi}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to get the error message from the response
          try {
            const errorData = await response.json();
            if (errorData.message === 'INVALIDCREDENTIALS') {
              throw new Error('Invalid credentials');
            }
          } catch {
            // If we can't parse the response, just throw a generic 401 error
          }
          throw new Error('HTTP error! status: 401');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const authInfo: AuthInfo = await response.json();
      this.setPropertiesFromAuthInfo(authInfo);
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method refreshes the auth token by using the refresh tokens (which are in cookies).
   * On success, it sets the auth info marks the user as logged in, and sets a timer to periodically refresh
   * the auth token
   * @returns A Promise which resolves when refresh is complete
   */
  async refreshLogin(): Promise<void> {
    try {
      const response = await fetch(`${environment.userApi}/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const authInfo: AuthInfo = await response.json();
      this.setPropertiesFromAuthInfo(authInfo);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets all appropriate properties when new authInfo is obtained
   * @param authInfo The new authInfo to set all the properties from
   */
  setPropertiesFromAuthInfo(authInfo: AuthInfo): void {
    this.authInfo = authInfo;
    this.processRefreshTokenTimer();
    this.lastLoggedInAs = this.authInfo.user.email;
  }

  /**
   * This calls an endpoint which removes all the cookies from the client.
   * It then wipes out the AuthInfo and stops the refresh timer
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${environment.userApi}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      // Continue with cleanup even if logout request fails
      this.logger.error('Logout request failed:', error);
    }

    this.authInfo = undefined;
    localStorage.removeItem('user');
    localStorage.removeItem('chargeSessionHistory');
    this.stopRefreshTokenTimer();
  }

  /** This method provides a way for the caller to initiate the automatic periodic refresh of the
   * auth token. It is called during application initializer, when the initial attempt to refresh on
   * application startup fails.
   */
  public startRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) return;

    this.processRefreshTokenTimer();
  }

  /**
   * This method is called every time the refreshTimeout occurs.
   * When called, it calculates a time which is half way between now, and when the auth token is due to expire.
   * It then creates a timeout which fires a request to refresh the users auth token. This call to refreshLoginToken
   * will call this method again if it is successful.
   * If the call fails, then this method calls itself to arrange another attempt halfway between now and expiry.
   * The method stops setting timers if the midway point is less than 10 seconds away.
   */
  private processRefreshTokenTimer(): void {
    this.stopRefreshTokenTimer();
    if (!this.authInfo) return;

    // parse json object from base64 encoded jwt token
    const dateNow = Date.now();
    const accessTokenExpiresTime: Date = new Date(
      this.authInfo.access_token_expiry
    );

    const halfWayBetweenNowAndExpiryMs =
      (accessTokenExpiresTime.getTime() - dateNow) / 2;

    if (halfWayBetweenNowAndExpiryMs < 10000) {
      this.logger.debug(
        `refresh timer not set as timeout too soon - ${halfWayBetweenNowAndExpiryMs}`
      );
      return;
    }

    this.logger.debug(
      `refresh timer set to fire at ${new Date(
        dateNow + halfWayBetweenNowAndExpiryMs
      ).toISOString()} (in ${halfWayBetweenNowAndExpiryMs} seconds)`
    );

    this.refreshTokenTimeout = setTimeout(async () => {
      try {
        await this.refreshLogin();
      } catch (error) {
        this.processRefreshTokenTimer();
      }
    }, halfWayBetweenNowAndExpiryMs);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
