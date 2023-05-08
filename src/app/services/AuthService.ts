import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/LoginResponse";
import {environment} from "../../environments/environment";
import {RefreshResponse} from "../models/RefreshResponse";

//const BACKEND_AUTH_API = 'http://localhost:8080/api/v1/auth/'
//const BACKEND_AUTH_API = 'https://eventhorizonbackend.azurewebsites.net/api/v1/auth/';
const BACKEND_AUTH_API = environment.authApi;

const defaultHttpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  /**
   * send login request to backend
   * @param email
   * @param passwordClear
   */
  login(email: string, passwordClear: string): Observable<LoginResponse> {

    let password = window.btoa(passwordClear);

    return this.http.post<LoginResponse>(
      BACKEND_AUTH_API + 'login',
      {
        email,
        password,
      },
      defaultHttpOptions
    );
  }

  /**
   * send register request to backend
   * @param email
   * @param password
   */
  register(email: string, password: string): Observable<any> {

    return this.http.post(
      BACKEND_AUTH_API + 'register',
      {
        email,
        password,
      },
      defaultHttpOptions
    );
  }

  /**
   * send register request with data from link
   * @param email
   * @param password
   * @param first_name
   * @param last_name
   * @param userIdEmail
   * @param orgaId
   * @param userModel
   */
  registerWithLink(email: string,
                   passwordClear: string,
                   first_name: string,
                   last_name: string,
                   userIdEmail: string,
                   orgaId: string,
                   userModel: string): Observable<any> {

    let password = window.btoa(passwordClear);

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: new HttpParams()
        .append("newUser", "true")
        .append("UserIdEmail", encodeURIComponent(userIdEmail))
        .append("OrganizationId", encodeURIComponent(orgaId))
        .append("createdUserModel", encodeURIComponent(userModel))
    };

    return this.http.post(
      BACKEND_AUTH_API + 'register',
      {
        email,
        password,
        first_name,
        last_name
      },
      httpOptions
    );
  }

  /**
   * send answer to org invitation
   * @param email
   * @param userIdEmail
   * @param orgaId
   * @param userModel
   * @param accept
   */
  answerOrgInvite(email: string,
                  userIdEmail: string,
                  orgaId: string,
                  userModel: string,
                  accept: string
  ):

    Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: new HttpParams()
        .append("newUser", "false")
        .append("UserIdEmail", encodeURIComponent(userIdEmail))
        .append("OrganizationId", encodeURIComponent(orgaId))
        .append("createdUserModel", encodeURIComponent(userModel))
        .append("accept", encodeURIComponent(accept))
    };

    return this.http.post(
      BACKEND_AUTH_API + 'response/invite',
      {},
      httpOptions
    );
  }

  /**
   * check if invite is available
   * @param newUser
   * @param orgaId
   * @param userModel
   */
  checkInvite(newUser: boolean,
              orgaId: string,
              userModel: string,
  ):

    Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: new HttpParams()
        .append("newUser", encodeURIComponent(newUser))
        .append("OrganizationId", encodeURIComponent(orgaId))
        .append("createdUserModel", encodeURIComponent(userModel))
    };

    return this.http.post(
      BACKEND_AUTH_API + 'invite/exist',
      {},
      httpOptions
    );
  }

  /**
   * send logout to backend
   * @param refresh_token
   */
  logout(refresh_token: string | null): Observable<any> {
    return this.http.post(
      BACKEND_AUTH_API + 'logout',
      {
        refresh_token
      },
      defaultHttpOptions);
  }

  /**
   * send request for reset password email
   * @param email
   */
  sendResetEmail(email: string): Observable<any> {
    return this.http.post(
      BACKEND_AUTH_API + 'forgotpassword',
      {},
      {
        headers: {'Content-Type': 'application/json'},
        params: {'email': email}
      }
    );
  }

  /**
   * reset password of user with reset token
   * @param resetToken
   * @param password
   */
  resetPassword(resetToken: string, passwordClear: string): Observable<any> {

    let password = window.btoa(passwordClear);

    return this.http.post(
      BACKEND_AUTH_API + 'resetpassword',
      {
        resetToken,
        password,
      },
      defaultHttpOptions
    );
  }

  /**
   * send request for refreshing of logged in token
   * @param refresh_token
   */
  refreshToken(refresh_token: string): Observable<RefreshResponse> {
    const tokenRequest = {refresh_token};
    return this.http.post<RefreshResponse>(
      BACKEND_AUTH_API + 'refreshtoken',
      tokenRequest,
      defaultHttpOptions
    );
  }
}
