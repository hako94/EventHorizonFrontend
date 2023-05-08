import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

//const BACKEND_API = 'http://localhost:8080/'
//const BACKEND_API = "https://eventhorizonbackend.azurewebsites.net/";
const BACKEND_API = environment.backendApi

@Injectable({
  providedIn: 'root',
})
export class CsrfService {

  constructor(private http: HttpClient) {}

  /**
   * get security csrf
   */
  getCsrf(): Observable<any> {
    return this.http.get<any>(
      BACKEND_API + 'api/v1/security/csrf',
    );
  }

}
