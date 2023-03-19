import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

const BACKEND_API = "https://eventhorizonbackend.azurewebsites.net/";

@Injectable({
  providedIn: 'root',
})
export class CsrfService {

  constructor(private http: HttpClient) {}

  getCsrf(): Observable<any> {
    return this.http.get<any>(
      BACKEND_API + 'api/v1/security/csrf',
    );
  }

}
