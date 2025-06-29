import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private http: HttpClient, private logger: NGXLogger) {
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
   * - Uses the angular httpClient to make a call to the login endpoint of the user api
   * - withCredentials set to true indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers
   * - on success, the AuthInfo is set and a timer starts which refreshes the auth token periodically
   * @param {string} email
   * @param {string} password
   * @returns {Observable} an observable of a user
   */
  login(email: string, password: string) {
    return this.http
      .post<AuthInfo>(
        `${environment.userApi}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((authInfo) => {
          this.setPropertiesFromAuthInfo(authInfo);
        })
      );
  }

  /**
   * This method refreshes the auth token by using the refresh tokens (which are in cookies).
   * On success, it sets the auth inof marks the user as logged in, and sets a timer to preiodically refresh
   * the auth token
   * @returns An Observable which returns AuthInfo to the caller
   */
  refreshLogin() {
    return this.http
      .get<AuthInfo>(`${environment.userApi}/auth/refresh`, {
        withCredentials: true,
      })
      .pipe(
        map((authInfo) => {
          this.setPropertiesFromAuthInfo(authInfo);
        })
      );
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
   * It the wipes out the AuthInfo and stops the refresh timer
   */
  logout() {
    this.http
      .get(`${environment.userApi}/auth/logout`, {
        withCredentials: true,
        responseType: 'text',
      })
      .subscribe();
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

    this.refreshTokenTimeout = setTimeout(
      () =>
        this.refreshLogin().subscribe({
          error: () => {
            this.processRefreshTokenTimer();
          },
        }),
      halfWayBetweenNowAndExpiryMs
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
