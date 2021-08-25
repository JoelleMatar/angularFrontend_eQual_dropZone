import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, ReplaySubject } from 'rxjs';
import { catchError } from "rxjs/operators";

import { UserClass } from '../classes/user.class';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})

/**
 * This service offers a getObservable() method allowing to access an Observable that any component can subscribe to.
 * Subscribers will allways receive the latest emitted value as a User object.
 * 
 * Only methods authenticate() and signout() update the observable. In the latter case, User object will have its id set to 0, 
 * in the former, the User object will be populated with values reveived from the server.
 */
export class AuthService {
  readonly MAX_RETRIES = 2;
  
  private _user = new UserClass();

  // internal counter for preventing infinite-loop in case of server error
  private retries = 0;

  // timestamp of last auth
  public last_auth_time: number;

  private observable: ReplaySubject<any>;

  public getObservable() {
    return this.observable;
  }
  
  get user(): any {
    return this._user;
  }

  set user(user: any) {
    this._user = {...this._user, ...user};
    // notify subscribers
    this.observable.next(this._user);
  }

  constructor(private http: HttpClient) { 
    this.observable = new ReplaySubject<any>(1);
    this.last_auth_time = -1;
  }

  /**
   * Upon success, this method updates the `user` member of the class accordingly to the object received. 
   * Otherwise, it throws an error holding the httpResponse.
   * 
   * @throws HttpErrorResponse  In case an error is returned, the respons object is relayed as an Exception.
   */
  public async authenticate() {
    console.log('AuthService::authenticate');
    
      // attempt to log the user in
      try {
        const data = await this.http.get<any>(environment.backend_url + '/?get=userinfo').toPromise();

        this.last_auth_time = new Date().getTime();

        let user = new UserClass();
        user.id = data.id;
        user.login = data.login;
        user.language = data.language;

        // update local user object and notify subscribers
        this.user = user;
      } 
      catch(httpErrorResponse:any) {
        let response = <HttpErrorResponse> httpErrorResponse;

        if(response.hasOwnProperty('status') && response.status == 401) {
          let body = response.error;
          let error_code = Object.keys(body.errors)[0];
          let error_id = body.errors[error_code];
          if(error_id == 'auth_expired_token') {
            try {
              if(this.retries < this.MAX_RETRIES) {
                ++this.retries;
                // request a refresh of the access token
                await this.refreshToken();
                // try to auth once more
                await this.authenticate();
              }
              else {
                throw response;
              }
            }
            catch(error:any) {
              response = error;
            }
          }
        }

        throw response;
      }  

  }

  public async signOut() {
    console.log('AuthService::signOut');
    // send a request to remove the cookie and revoke access_token
    try {
      const data = await this.http.get<any>(environment.backend_url + '/?do=user_signout').toPromise();
      // update local user object and notify subscribers
      this.user = new UserClass();
    } 
    catch(httpErrorResponse:any) {
      console.log('unable to sign out', httpErrorResponse);
      throw httpErrorResponse;
    }
  }

  /**
   * Upon success, the response from the server should contain httpOnly cookies holding access_token and refresh_token.
   * 
   * @param login string  email address of the user to log in
   * @param password string untouched string of password given by user
   * 
   * @returns Promise
   * @throws HttpErrorResponse  HTTP error that occured during user login 
   */
  public async signIn(login: string, password: string) {
    try {
      const data = await this.http.get<any>(environment.backend_url+'/?do=user_signin', {
          params: {
            login: login,
            password: password
          }
      })
      .pipe(
        catchError((response: HttpErrorResponse, caught: Observable<any>) => {
          throw response;
        })
      )
      .toPromise();

      // authentication will trigger router navigation within running controller
      await this.authenticate();
    }
    catch(response) {
      throw response;
    }
  }


  /**
   * @param email string  email address related to the account to recover
   * @returns void
   * @async
   * @throws HttpErrorResponse  HTTP error that occured during user login 
   */
   public async passRecover(email: string) {
      const data = await this.http.get<any>(environment.backend_url+'/?do=user_pass-recover', {
          params: {
              email: email
          }
      });
  }

  /**
   * Upon success an new acces token is received as httpOnly cookie (and stored by the browser). Otherwise no change is made.
   * 
   * @returns Promise
   * @throws HttpErrorResponse  HTTP error that occured during user login 
   */
  private async refreshToken() {
      try {
        const data = await this.http.get<any>(environment.backend_url+'/?get=auth_refresh', { params: {} })
        .pipe(
          catchError((err: HttpErrorResponse, caught: Observable<any>) => {
            throw err;
          })
        )
        .toPromise();          
      }
      catch(err) {
        throw err;
      }
  }  

}