import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {OrganizationModel} from "../models/OrganizationModel";
import {OrganizationEventModel} from "../models/OrganizationEventModel";
import {CreateEventModel} from "../models/CreateEventModel";
import {OrganizationUserModel} from "../models/OrganizationUserModel";
import {EventTemplateModel} from "../models/EventTemplateModel";
import {AvailableTemplateList} from "../models/AvailableTemplateList";
import {ChatHistoryModel} from "../models/ChatHistoryModel";
import {EventQuestionnairesModel} from "../models/EventQuestionnairesModel";
import {UserAtEventModel} from "../models/UserAtEventModel";
import {environment} from "../../environments/environment";
import {OrganizationInviteModel} from "../models/OrganizationInviteModel";
import {UserRoleModel} from "../models/UserRoleModel";
import {EmailTemplateModel} from "../models/EmailTemplateModel";
import {EventTemplatePrefillModel} from "../models/EventTemplatePrefillModel";
import {EventInviteModel} from "../models/EventInviteModel";
import {UserForEventWithRoleModel} from "../models/UserForEventWithRoleModel";
import {NotificationInfoModel} from "../models/NotificationInfoModel";
import {UserEventInviteModel} from "../models/UserEventInviteModel";
import {ChatAnswerModel} from "../models/ChatAnswerModel";
import {EventStatusModel} from "../models/EventStatusModel";

//const BACKEND_API = 'http://localhost:8080/'
//const BACKEND_API = "https://eventhorizonbackend.azurewebsites.net/";
const BACKEND_API = environment.backendApi;


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root',
})

/**
 * Sends http requests to the backend-api and returns the http response to the respective component
 */
export class DataService {

  constructor(private http: HttpClient) {
  }

  privatePing(): Observable<any> {
    return this.http.get<any>(
      BACKEND_API + 'private-test/ping',
      httpOptions
    );
  }

  getOrganizations(): Observable<OrganizationModel[]> {
    return this.http.get<OrganizationModel[]>(
      BACKEND_API + 'api/v1/organizations',
      httpOptions
    );
  }

  getOrganizationEvents(orgaId: string): Observable<OrganizationEventModel[]> {
    return this.http.get<OrganizationEventModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/events',
      httpOptions
    )
  }

  postEventInOrganizationAndPersist(orgaId: string, model: any): Observable<HttpResponse<any>> {
    return this.http.post(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/events',
      model,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  getOrganizationMember(orgId: string): Observable<OrganizationUserModel[]> {
    return this.http.get<OrganizationUserModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/members',
      httpOptions
    )
  }

  changeOrganizationMemberRole(orgId: string, memberId: string, role: number): Observable<string> {
    return this.http.put<string>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/member/' + memberId,
      {
        userId: memberId,
        role: {
          id: role,
          role: this.mapRoleIdToString(role),
        }
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  mapRoleIdToString(id: number): string {
    if (id == 1){
      return 'admin';
    } else if (id == 2){
      return 'organisator';
    } else if (id == 3){
      return 'tutor';
    } else if (id == 4){
      return 'teilnehmer';
    } else if (id == 5) {
      return 'gast';
    } else if (id == 10) {
      return 'Organisator';
    } else if (id == 11){
      return 'Tutor';
    } else if (id == 12){
      return 'Teilnehmer';
    } else {
      return 'error';
    }
  }

  deleteOrganizationMember(orgId: string, memberId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/member/' + memberId,
      httpOptions
    )
  }

  getOrganizationInvites(orgId: string): Observable<OrganizationInviteModel[]> {
    return this.http.get<OrganizationInviteModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/invites',
      httpOptions
    )
  }

  deleteOrganizationInvite(orgId: string, inviteId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/invite/' + inviteId,
      httpOptions
    )
  }

  changeOrganizationInviteRole(orgId: string, inviteId: string, roleId: number): Observable<string> {
    return this.http.put<string>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/invite/' + inviteId,
      {
        inviteId: inviteId,
        role: {
          id: roleId,
          role: this.mapRoleIdToString(roleId)
        }
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  getAllEventsForUser(dateFrom: string, dateTo: string): Observable<OrganizationEventModel[]> {
    return this.http.get<OrganizationEventModel[]>(
      BACKEND_API + 'api/v1/organizations/events',
      {
        params: {
          'dateFrom' : dateFrom,
          'dateTo' : dateTo
        }
      }
    )
  }

  inviteUser(email: string, orgId: string, asRole: string): Observable<string> {
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

  loadTemplates(orgId: string): Observable<EventTemplateModel[]> {
    return this.http.get<EventTemplateModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/eventtemplates',
      httpOptions
    )
  }

  loadTemplateBasedOnId(orgId: string, templateId : string): Observable<EventTemplatePrefillModel> {
    return this.http.get<EventTemplatePrefillModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/eventtemplate/' + templateId,
      httpOptions
    )
  }

  safeTemplate(orgId: string, template: EventTemplatePrefillModel): Observable<EventTemplatePrefillModel> {
    return this.http.post<EventTemplatePrefillModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/eventtemplates',
      template,
      httpOptions
    )
  }

  storeFile(formData: FormData, orgId: string): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/files',
      formData,
      {params: {'orgId': orgId}}
    )
  }

  storeEventImage(formData: FormData, orgId: string, id : string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/files',
      formData,
      {
        observe: 'response',
        params: {
          'orgId': orgId,
          'eventId' : id,
          'isEventPicture' : true
        }
      }
    )
  }

  getImage(orgId: string, fileId: string): Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        responseType: "blob",
        params: {'orgId': orgId}

      }
    )
  }

  getImageForEvent(orgId: string, fileId: string, eventId : string): Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        responseType: "blob",
        params: {
          'orgId': orgId,
          'eventId' : eventId
        }
      }
    )
  }

  getAvailableTemplates(orgaId: string): Observable<AvailableTemplateList[]> {
    return this.http.get<AvailableTemplateList[]>(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/events/eventtemplates',
      httpOptions
    )
  }

  getOrganizationInfos(orgId: string): Observable<OrganizationModel> {
    return this.http.get<OrganizationModel>(
      BACKEND_API + 'api/v1/organization/' + orgId,
      httpOptions
    )
  }

  acceptEvent(orgId: string, eventId: string, userId: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/book',
      {},
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'},
        params: {'email': userId}
      }
    )
  }

  leaveEvent(orgId: string, eventId: string, userId: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/signoff',
      {},
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'},
        params: {'email': userId}
      }
    )
  }

  deleteEvent(orgId: string, eventId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId,
      httpOptions
    )
  }

  createEventQuestionnaires(orgId: string, eventId: string, eventQuestionnairesModel: EventQuestionnairesModel): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/questionnaires',
      eventQuestionnairesModel,
      httpOptions
    )
  }

  loadAvailableEventQuestionnaires(orgId: string, eventId: string): Observable<EventQuestionnairesModel[]> {
    return this.http.get<EventQuestionnairesModel[]>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId + '/questionnaires',
      httpOptions
    )
  }

  getChatHistory(orgId: string, eventId: string | undefined): Observable<ChatAnswerModel[]> {
    return this.http.get<ChatAnswerModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/chat',
      httpOptions
    )
  }

  getAttendeesWithPresence(orgId: string, eventId: string): Observable<UserAtEventModel[]> {
    return this.http.get<UserAtEventModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/attendees',
      httpOptions
    )
  }

  saveAttendeesWithPresence(orgId: string, eventId: string, users: UserAtEventModel[]): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/attendees',
      users,
      httpOptions
    )
  }

  getAttendeesWithRole(orgId: string, eventId: string): Observable<UserForEventWithRoleModel[]> {
    return this.http.get<UserForEventWithRoleModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/persons',
      httpOptions
    )
  }


  saveAttenderRole(orgId: string, eventId: string, attenderId: string, role: number): Observable<any> {
    return this.http.put<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/personrole',
      {
        id: attenderId,
        role: {
          id: role,
          role: this.mapRoleIdToString(role),
        }
      },
      httpOptions
    )
  }

  deleteAttenderFromEvent(orgId: string, eventId: string, email: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/signoff',
      {},
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'},
        params: {'orgId': orgId, 'eventId': eventId, 'email': email}
      }
    )
  }

  inviteUserToEvent(orgId: string, eventId: string, userId: string, role: number): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/invite',
      {
        userId: userId,
        role: {
          id: role,
          role: this.mapRoleIdToString(role),
        }
      },
      httpOptions
    )
  }

  createOrganization(name: string, email: string, description: string): Observable<any> {
    return this.http.post<OrganizationModel>(
      BACKEND_API + 'api/v1/admin/organization',
      {
        'name': name,
        'description': description,
        'email': email
      },
      httpOptions
    )
  }

  deleteOrganization(orgId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/admin/organization/' + orgId,
      httpOptions
    )
  }

  deleteDatabase(): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/admin/database/',
      httpOptions
    )
  }

  resetDatabase(): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/admin/database/',
      httpOptions
    )
  }

  getEmailTemplates(orgId: string): Observable<EmailTemplateModel[]> {
    return this.http.get<EmailTemplateModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/emailtemplates',
      httpOptions
    )
  }

  postMailTemplate(mailName: string, orgaId: string, mailSubject: string, mailText: string): Observable<any> {
    return this.http.post<OrganizationModel>(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/emailtemplates',
      {
        'name': mailName,
        'organizationId': orgaId,
        'subject': mailSubject,
        'text': mailText
      },
      httpOptions
    )
  }

  saveEmailTemplate(orgId: string, templateId: string, emailTemplate: EmailTemplateModel): Observable<string> {
    return this.http.put<string>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/emailtemplate/' + templateId,
      {
        id: templateId,
        name: emailTemplate.name,
        subject: emailTemplate.subject,
        text: emailTemplate.text
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  deleteMailTemplate(orgId: string, templateId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/emailtemplate/' + templateId,
      httpOptions
    )
  }

  getNotificationInfos(orgId: string, eventId: string): Observable<any> {
    return this.http.get<NotificationInfoModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/notifications',
      httpOptions
    )
  }

  deleteNotificationInfo(orgaID: string, eventID: string, notificationId: string) : Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/event/' + eventID + '/notification/' + notificationId,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  postNotificationInfo(orgaId: string, eventId: string, templateId: string, time: string, isBefore: boolean): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/event/' + eventId + '/notifications',
      {
        'templateId': templateId,
        'time': time,
        'before': isBefore
      },
      httpOptions
    )
  }

  deleteTemplate(orgaID: string, templateId: string) : Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/eventtemplate/' + templateId,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  getEventInvites(orgId: string, eventId: string): Observable<any> {
    return this.http.get<EventInviteModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/events/' + eventId + '/invites',
      httpOptions
    )
  }

  deleteEventInvite(orgaID: string, eventID: string, inviteId: string) : Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/events/' + eventID + '/invites/' + inviteId,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  changeEventInviteRole(orgId: string, eventId: string, inviteId: string, roleId: number): Observable<string> {
    return this.http.put<string>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/events/' + eventId + '/invites/' + inviteId,
      {
        id: inviteId,
        role: {
          id: roleId,
          role: this.mapRoleIdToString(roleId)
        }
      },
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  getSingleEvent(orgaID: string, eventID: string) : Observable<OrganizationEventModel> {
    return this.http.get<OrganizationEventModel>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/event/' + eventID
    )
  }

  getUserRoleForEvent(orgId: string, eventId: string): Observable<UserRoleModel>{
    return this.http.get<UserRoleModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/role',
      httpOptions
    )
  }

  getEventStatus(orgId: string, eventId: string): Observable<EventStatusModel>{
    return this.http.get<EventStatusModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/status',
      httpOptions
    )
  }
}
