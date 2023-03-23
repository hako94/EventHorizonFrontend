import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {flatMap, Observable, tap} from "rxjs";
import {OrganizationModel} from "../models/OrganizationModel";
import {OrganizationEventModel} from "../models/OrganizationEventModel";
import {CreateEventModel} from "../models/CreateEventModel";
import {UserRoleModel} from "../models/UserRoleModel";
import {OrganizationUserModel} from "../models/OrganizationUserModel";

const BACKEND_API = 'http://localhost:8080/'
//const BACKEND_API = "https://eventhorizonbackend.azurewebsites.net/";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) {}

  privateping(): Observable<any> {
    return this.http.get<any>(
      BACKEND_API + 'private-test/ping',
      httpOptions
    );
  }

  getOrganizations() : Observable<OrganizationModel[]> {
    return this.http.get<OrganizationModel[]>(
      BACKEND_API + 'api/v1/organizations',
      httpOptions
    );
  }

  getOrganizationEvents(orgaId : string) : Observable<OrganizationEventModel[]> {
    return this.http.get<OrganizationEventModel[]>(
      BACKEND_API + 'api/v1/organizations/'+ orgaId +'/events',
      httpOptions
    )
  }

  postEventInOrganization(orgaId : string, model : CreateEventModel) : Observable<any> {
    return this.http.post(
      BACKEND_API + 'api/v1/organizations/'+ orgaId +'/events',
      model,
      httpOptions
    )
  }

  getOrganizationMember(orgId : string) : Observable<OrganizationUserModel[]> {
    return this.http.get<OrganizationUserModel[]>(
      BACKEND_API + 'api/v1/organization/'+ orgId +'/member',
      httpOptions
    )
  }

  inviteUser(email : string, orgId : string) : Observable<string> {
    return this.http.post<string>(
      BACKEND_API + 'api/v1/authenticatedUser/invite',
      {
        email: email,
        organizationId: orgId
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

}
