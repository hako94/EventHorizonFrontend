import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable} from "rxjs";
import {OrganizationModel} from "../models/OrganizationModel";
import {OrganizationEventModel} from "../models/OrganizationEventModel";
import {CreateEventModel} from "../models/CreateEventModel";
import {OrganizationUserModel} from "../models/OrganizationUserModel";
import {EventTemplateModel} from "../models/EventTemplateModel";
import {AvailableTemplateList} from "../models/AvailableTemplateList";
import {ChatHistoryModel} from "../models/ChatHistoryModel";
import {ChatModel} from "../models/ChatModel";
import {EventQuestionnairesModel} from "../models/EventQuestionnairesModel";
import {UserAtEventModel} from "../models/UserAtEventModel";

//const BACKEND_API = 'http://localhost:8080/'
const BACKEND_API = "https://eventhorizonbackend.azurewebsites.net/";

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

  inviteUser(email : string, orgId : string, asRole : string) : Observable<string> {
    return this.http.post<string>(
      BACKEND_API + 'api/v1/authenticatedUser/invite',
      {
        email: email,
        organizationId: orgId,
        asRole: asRole
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  loadTemplate(orgId : string, templateID : string) : Observable<EventTemplateModel> {
    return this.http.get<EventTemplateModel>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/eventtemplates/' + templateID,
      httpOptions
    )
  }

  safeTemplate(orgId : string, template : EventTemplateModel) : Observable<EventTemplateModel> {
    return this.http.post<EventTemplateModel>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/eventtemplates',
      template,
      httpOptions
    )
  }

  storeFile(formData : FormData, orgId : string) : Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/files',
      formData,
      {params: {'orgId':orgId}}
    )
  }

  getImage(orgId : string, fileId : string) : Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/files/'+ fileId,
      { responseType: "blob",
        params: {'orgId':orgId}

      }
    )
  }

  getAvailableTemplates(orgaId : string) : Observable<AvailableTemplateList[]> {
    return this.http.get<AvailableTemplateList[]>(
      BACKEND_API + 'api/v1/organizations/' + orgaId + '/events/eventtemplates',
      httpOptions
    )
  }

  getOrganizationInfos(orgId : string) : Observable<OrganizationModel> {
    return this.http.get<OrganizationModel>(
     BACKEND_API + 'api/v1/organization/'+orgId,
     httpOptions
    )
  }

  acceptEvent(orgId : string, eventId : string, userId : string) : Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/book/' + userId,
      httpOptions
    )
  }

  deleteEvent(orgId : string, eventId : string) : Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId,
      httpOptions
    )
  }

  leaveEvent(orgId : string, eventId : string, userId : string) : Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/signoff/' + userId,
      httpOptions
    )
  }

  createEventQuestionnaires(orgId : string, eventId : string, eventQuestionnairesModel : EventQuestionnairesModel) : Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/questionnaires',
      eventQuestionnairesModel,
      httpOptions
    )
  }

  loadAvailableEventQuestionnaires(orgId : string, eventId : string) : Observable<EventQuestionnairesModel[]>{
    return this.http.get<EventQuestionnairesModel[]>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/questionnaires',
      httpOptions
    )
  }

  getChatHistory(orgId: string, eventId: string | undefined) : Observable<ChatHistoryModel[]> {
    return this.http.get<ChatHistoryModel[]>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/chat',
      httpOptions
    )
  }

  getUserMangamnetList(orgId: string, eventId: string) : Observable<UserAtEventModel[]> {
    return this.http.get<UserAtEventModel[]>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/attendees',
      httpOptions
    )
  }

  saveUserMangamnetList(orgId: string, eventId: string, users : UserAtEventModel[]) : Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/attendees',
      users,
      httpOptions
    )
  }
}
