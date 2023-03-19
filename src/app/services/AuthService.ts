import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/LoginResponse";

const BACKEND_AUTH_API = 'https://eventhorizonbackend.azurewebsites.net/';

const httpOptions = {
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
      httpOptions
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(
      BACKEND_AUTH_API + 'register',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(BACKEND_AUTH_API + 'signout', { }, httpOptions);
  }
}
