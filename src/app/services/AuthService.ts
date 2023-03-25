import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/LoginResponse";

const BACKEND_AUTH_API = 'http://localhost:8080/api/v1/auth/'
//const BACKEND_AUTH_API = 'https://eventhorizonbackend.azurewebsites.net/api/v1/auth/';

const defaultHttpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      BACKEND_AUTH_API + 'login',
      {
        email,
        password,
      },
      defaultHttpOptions
    );
  }

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

  registerWithLink(email: string,
                   password: string,
                   first_name: string,
                   last_name: string,
                   userIdEmail : string,
                   orgaId : string,
                   userModel : string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams()
        .append("newUser","true")
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

  logout(): Observable<any> {
    return this.http.post(BACKEND_AUTH_API + 'signout', { }, defaultHttpOptions);
  }
}
