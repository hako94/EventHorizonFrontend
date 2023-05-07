import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {OrganizationModel} from "../models/OrganizationModel";
import {OrganizationEventModel} from "../models/OrganizationEventModel";
import {OrganizationUserModel} from "../models/OrganizationUserModel";
import {EventTemplateModel} from "../models/EventTemplateModel";
import {AvailableTemplateList} from "../models/AvailableTemplateList";
import {UserAtEventModel} from "../models/UserAtEventModel";
import {environment} from "../../environments/environment";
import {OrganizationInviteModel} from "../models/OrganizationInviteModel";
import {EmailTemplateModel} from "../models/EmailTemplateModel";
import {EventTemplatePrefillModel} from "../models/EventTemplatePrefillModel";
import {EventInviteModel} from "../models/EventInviteModel";
import {UserForEventWithRoleModel} from "../models/UserForEventWithRoleModel";
import {NotificationInfoModel} from "../models/NotificationInfoModel";
import {ChatAnswerModel} from "../models/ChatAnswerModel";
import {EventStatusModel} from "../models/EventStatusModel";
import {EventRoleStatusModel} from "../models/EventRoleStatusModel";
import {QuestionnairePostModel} from "../models/QuestionnairePostModel";
import {QuestionnaireInfoModel} from "../models/QuestionnaireInfoModel";
import {QuestionnaireModel} from "../models/QuestionnaireModel";
import {QuestionAnswerModel} from "../models/QuestionAnswerModel";
import {QuestionnaireEvaluationModel} from "../models/QuestionnaireEvaluationModel";

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

  /**
   * get data for organizations
   */
  getOrganizations(): Observable<OrganizationModel[]> {
    return this.http.get<OrganizationModel[]>(
      BACKEND_API + 'api/v1/organizations',
      httpOptions
    );
  }

  /**
   * get events for one org
   * @param orgaId
   */
  getOrganizationEvents(orgaId: string): Observable<OrganizationEventModel[]> {
    return this.http.get<OrganizationEventModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/events',
      httpOptions
    )
  }

  /**
   * save new event in organization
   * @param orgaId
   * @param model
   */
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

  /**
   * get all members of one org
   * @param orgId
   */
  getOrganizationMember(orgId: string): Observable<OrganizationUserModel[]> {
    return this.http.get<OrganizationUserModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/members',
      httpOptions
    )
  }

  /**
   * change the role of one member of one org
   * @param orgId
   * @param memberId
   * @param role
   */
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

  /**
   * maps a roleID to the string value of the role
   * @param id
   */
  mapRoleIdToString(id: number): string {
    if (id == 1) {
      return 'Admin';
    } else if (id == 2) {
      return 'Organisator';
    } else if (id == 3) {
      return 'Tutor';
    } else if (id == 4) {
      return 'Teilnehmer';
    } else if (id == 5) {
      return 'Gast';
    } else if (id == 10) {
      return 'Organisator';
    } else if (id == 11) {
      return 'Tutor';
    } else if (id == 12) {
      return 'Teilnehmer';
    } else {
      return 'error';
    }
  }

  /**
   * delete one member from one org
   * @param orgId
   * @param memberId
   */
  deleteOrganizationMember(orgId: string, memberId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/member/' + memberId,
      httpOptions
    )
  }

  /**
   * get all invites into one org
   * @param orgId
   */
  getOrganizationInvites(orgId: string): Observable<OrganizationInviteModel[]> {
    return this.http.get<OrganizationInviteModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/invites',
      httpOptions
    )
  }

  /**
   * delete one invitation from one org
   * @param orgId
   * @param inviteId
   */
  deleteOrganizationInvite(orgId: string, inviteId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/invite/' + inviteId,
      httpOptions
    )
  }

  /**
   * change the role of one invitation to one org
   * @param orgId
   * @param inviteId
   * @param roleId
   */
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

  /**
   * get every event for a user in a specific period of time
   * @param dateFrom
   * @param dateTo
   */
  getAllEventsForUser(dateFrom: string, dateTo: string): Observable<OrganizationEventModel[]> {
    return this.http.get<OrganizationEventModel[]>(
      BACKEND_API + 'api/v1/organizations/events',
      {
        params: {
          'dateFrom': dateFrom,
          'dateTo': dateTo
        }
      }
    )
  }

  /**
   * invite a user to one org as defined role
   * @param email
   * @param orgId
   * @param asRole
   */
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

  /**
   * load every event template for one organization
   * @param orgId
   */
  loadTemplates(orgId: string): Observable<EventTemplateModel[]> {
    return this.http.get<EventTemplateModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/eventtemplates',
      httpOptions
    )
  }

  /**
   * load one template from one org
   * @param orgId
   * @param templateId
   */
  loadTemplateBasedOnId(orgId: string, templateId: string): Observable<EventTemplatePrefillModel> {
    return this.http.get<EventTemplatePrefillModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/eventtemplate/' + templateId,
      httpOptions
    )
  }

  /**
   * safe a template in one org
   * @param orgId
   * @param template
   */
  safeTemplate(orgId: string, template: EventTemplatePrefillModel): Observable<EventTemplatePrefillModel> {
    return this.http.post<EventTemplatePrefillModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/eventtemplates',
      template,
      httpOptions
    )
  }

  /**
   * store a file for one org
   * @param formData
   * @param orgId
   */
  storeFile(formData: FormData, orgId: string): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/files',
      formData,
      {params: {'orgId': orgId}}
    )
  }

  /**
   * store a file for one event in one org
   * @param formData
   * @param orgId
   * @param eventId
   */
  storeFileForEvent(formData: FormData, orgId: string, eventId: string): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/files',
      formData,
      {
        params: {
          'orgId': orgId,
          'eventId': eventId
        }
      }
    )
  }

  /**
   * store the event image for one event
   * @param formData
   * @param orgId
   * @param id
   */
  storeEventImage(formData: FormData, orgId: string, id: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/files',
      formData,
      {
        observe: 'response',
        params: {
          'orgId': orgId,
          'eventId': id,
          'isEventPicture': true
        }
      }
    )
  }

  /**
   * get the image by the id for org, event
   * @param orgId
   * @param fileId
   */
  getImage(orgId: string, fileId: string): Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        responseType: "blob",
        params: {'orgId': orgId}
      }
    )
  }

  /**
   * get the infos for every file in one event of one org
   * @param orgId
   * @param eventId
   */
  getFileInfosForEvent(orgId: string, eventId: string): Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/files',
      {
        params: {
          'orgId': orgId,
          'eventId': eventId
        }
      }
    )
  }

  /**
   * get the actual file by the fileID for one event in one org
   * @param orgId
   * @param fileId
   * @param eventId
   */
  getFileForEvent(orgId: string, fileId: string, eventId: string): Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        responseType: "blob",
        params: {
          'orgId': orgId,
          'eventId': eventId
        },
        observe: 'response',
      },
    )
  }

  /**
   * get the actual file by the fileID for one event template in one org
   * @param orgId
   * @param fileId
   * @param eventTemplateId
   */
  getFileForEventTemplate(orgId: string, fileId: string, eventTemplateId: string): Observable<any> {
    return this.http.get(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        responseType: "blob",
        params: {
          'orgId': orgId,
          'eventTemplateId': eventTemplateId
        },
        observe: 'response',
      },
    )
  }

  /**
   * delete one file by the fileID in one event of one org
   * @param orgId
   * @param eventId
   * @param fileId
   */
  deleteFileFromEvent(orgId: string, eventId: string, fileId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: {
          'orgId': orgId,
          'eventId': eventId
        }
      }
    )
  }

  /**
   * delete one file by the fileID in one event template of one org
   * @param orgId
   * @param eventTemplateId
   * @param fileId
   */
  deleteFileFromEventTemplate(orgId: string, eventTemplateId: string, fileId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/files/' + fileId,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: {
          'fileId': fileId,
          'orgId': orgId,
          'eventTemplateId': eventTemplateId
        }
      }
    )
  }

  /**
   * get every event template for one org
   * @param orgaId
   */
  getAvailableTemplates(orgaId: string): Observable<AvailableTemplateList[]> {
    return this.http.get<AvailableTemplateList[]>(
      BACKEND_API + 'api/v1/organization/' + orgaId + '/events/eventtemplates',
      httpOptions
    )
  }

  /**
   * get data for one org
   * @param orgId
   */
  getOrganizationInfos(orgId: string): Observable<OrganizationModel> {
    return this.http.get<OrganizationModel>(
      BACKEND_API + 'api/v1/organization/' + orgId,
      httpOptions
    )
  }

  /**
   * book user into event
   * @param orgId
   * @param eventId
   * @param userId
   */
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

  /**
   * accept invite for one event
   * @param orgId
   * @param eventId
   */
  acceptEventInvite(orgId: string, eventId: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/inviteaccept',
      {},
      {
        headers: {'Content-Type': 'application/json'},
      }
    )
  }

  /**
   * decline invite for one event
   * @param orgId
   * @param eventId
   */
  declineEventInvite(orgId: string, eventId: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/invitedecline',
      {},
      {
        headers: {'Content-Type': 'application/json'},
      }
    )
  }

  /**
   * sign off from one event you were signed on
   * @param orgId
   * @param eventId
   * @param userId
   */
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

  /**
   * delete one event by eventID from one org
   * @param orgId
   * @param eventId
   */
  deleteEvent(orgId: string, eventId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organizations/' + orgId + '/events/' + eventId,
      httpOptions
    )
  }

  /**
   * create a new questionnaire at one event of one org
   * @param orgId
   * @param eventId
   * @param eventQuestionnairesModel
   */
  createEventQuestionnaires(orgId: string, eventId: string, eventQuestionnairesModel: QuestionnairePostModel): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaires',
      eventQuestionnairesModel,
      httpOptions
    )
  }

  /**
   * load every questionnaire in one event of one org
   * @param orgId
   * @param eventId
   */
  loadAvailableEventQuestionnaires(orgId: string, eventId: string): Observable<QuestionnaireInfoModel[]> {
    return this.http.get<QuestionnaireInfoModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaires',
      httpOptions
    )
  }

  /**
   * delete one questionnaire by ID in one event
   * @param orgId
   * @param eventId
   * @param id
   */
  deleteEventQuestionnaire(orgId: string, eventId: string, id: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaire/' + id,
      httpOptions
    )
  }

  /**
   * change the status of an existing questionnaire in one event of one org
   * @param orgId
   * @param eventId
   * @param surveyId
   * @param statusId
   * @param status
   */
  changeQuestionnaireStatus(orgId: string, eventId: string, surveyId: string, statusId: number, status: string): Observable<any> {
    return this.http.put<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaire/' + surveyId + '/status',
      {
        id: statusId,
        status: status
      },
      httpOptions
    )
  }

  /**
   * get one questionnaire by ID in one event
   * @param orgId
   * @param eventId
   * @param id
   */
  getQuestionnaire(orgId: string, eventId: string, id: string): Observable<QuestionnaireModel> {
    return this.http.get<QuestionnaireModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaire/' + id,
      httpOptions
    )
  }

  /**
   * submit all answers to a questionnaire in one event
   * @param orgId
   * @param eventId
   * @param questionnaireId
   * @param userId
   * @param questionAnswers
   */
  postQuestionnaireAnswer(orgId: string, eventId: string, questionnaireId: string, userId: string, questionAnswers: QuestionAnswerModel[]): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaire/' + questionnaireId + '/responses',
      {
        questionnaireId: questionnaireId,
        userId: userId,
        questionAnswers: questionAnswers
      },
      httpOptions
    )
  }

  /**
   * get evaluation of one questionnaire of one event
   * @param orgId
   * @param eventId
   * @param id
   */
  getQuestionnaireEvaluation(orgId: string, eventId: string, id: string): Observable<QuestionnaireEvaluationModel> {
    return this.http.get<QuestionnaireEvaluationModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/questionnaire/' + id + '/evaluation',
      httpOptions
    )
  }

  /**
   * get complete chat history of the event guide of one event
   * @param orgId
   * @param eventId
   */
  getChatHistory(orgId: string, eventId: string | undefined): Observable<ChatAnswerModel[]> {
    return this.http.get<ChatAnswerModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/chat',
      httpOptions
    )
  }

  /**
   * get all attendee with presence for a started event
   * @param orgId
   * @param eventId
   */
  getAttendeesWithPresence(orgId: string, eventId: string): Observable<UserAtEventModel[]> {
    return this.http.get<UserAtEventModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/attendees',
      httpOptions
    )
  }

  /**
   * save the latest version of the presence list of attendee in started event
   * @param orgId
   * @param eventId
   * @param users
   */
  saveAttendeesWithPresence(orgId: string, eventId: string, users: UserAtEventModel[]): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/attendees',
      users,
      httpOptions
    )
  }

  /**
   * get all attendee for a event thats not started with the role of every attendee
   * @param orgId
   * @param eventId
   */
  getAttendeesWithRole(orgId: string, eventId: string): Observable<UserForEventWithRoleModel[]> {
    return this.http.get<UserForEventWithRoleModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/persons',
      httpOptions
    )
  }


  /**
   * save the role of one attender in one event
   * @param orgId
   * @param eventId
   * @param attenderId
   * @param role
   */
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

  /**
   * sign a attender off an event
   * @param orgId
   * @param eventId
   * @param email
   */
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

  /**
   * invite a user of the org to one event
   * @param orgId
   * @param eventId
   * @param userId
   * @param role
   */
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

  /**
   * create a completely new organization
   * @param name
   * @param email
   * @param description
   */
  createOrganization(name: string, email: string, description: string): Observable<string> {
    return this.http.post<string>(
      BACKEND_API + 'api/v1/admin/organization',
      {
        'name': name,
        'description': description,
        'email': email
      },
      httpOptions
    )
  }

  /**
   * delete one complete organization
   * @param orgId
   */
  deleteOrganization(orgId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/admin/organization/' + orgId,
      httpOptions
    )
  }

  /**
   * delete the whole database, only for admins
   */
  deleteDatabase(): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/admin/database/',
      httpOptions
    )
  }

  /**
   * reset the whole database to test data, only for admins
   */
  resetDatabase(): Observable<any> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/admin/database/',
      httpOptions
    )
  }

  /**
   * get every email template for one org
   * @param orgId
   */
  getEmailTemplates(orgId: string): Observable<EmailTemplateModel[]> {
    return this.http.get<EmailTemplateModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/emailtemplates',
      httpOptions
    )
  }

  /**
   * create new email template in one org
   * @param mailName
   * @param orgaId
   * @param mailSubject
   * @param mailText
   */
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

  /**
   * save a email template of one org
   * @param orgId
   * @param templateId
   * @param emailTemplate
   */
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

  /**
   * delete a email template from one org
   * @param orgId
   * @param templateId
   */
  deleteMailTemplate(orgId: string, templateId: string): Observable<any> {
    return this.http.delete<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/emailtemplate/' + templateId,
      httpOptions
    )
  }

  /**
   * get every notification infos for the event emails
   * @param orgId
   * @param eventId
   */
  getNotificationInfos(orgId: string, eventId: string): Observable<any> {
    return this.http.get<NotificationInfoModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/notifications',
      httpOptions
    )
  }

  /**
   * delete one notification by ID
   * @param orgaID
   * @param eventID
   * @param notificationId
   */
  deleteNotificationInfo(orgaID: string, eventID: string, notificationId: string): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/event/' + eventID + '/notification/' + notificationId,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  /**
   * post new notification info in one template of one event in one org
   * @param orgaId
   * @param eventId
   * @param templateId
   * @param time
   * @param isBefore
   */
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

  /**
   * delete a event template by ID in one org
   * @param orgaID
   * @param templateId
   */
  deleteTemplate(orgaID: string, templateId: string): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/eventtemplate/' + templateId,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  /**
   * get the invites to one event in one org
   * @param orgId
   * @param eventId
   */
  getEventInvites(orgId: string, eventId: string): Observable<any> {
    return this.http.get<EventInviteModel[]>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/invites',
      httpOptions
    )
  }

  /**
   * delete one event invite by ID of one event in one org
   * @param orgaID
   * @param eventID
   * @param inviteId
   */
  deleteEventInvite(orgaID: string, eventID: string, inviteId: string): Observable<HttpResponse<any>> {
    return this.http.delete<HttpResponse<any>>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/event/' + eventID + '/invite/' + inviteId,
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  /**
   * change the role of one invite to a event in one org
   * @param orgId
   * @param eventId
   * @param inviteId
   * @param roleId
   */
  changeEventInviteRole(orgId: string, eventId: string, inviteId: string, roleId: number): Observable<string> {
    return this.http.put<string>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/invite/' + inviteId,
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

  /**
   * get one event by ID in one org
   * @param orgaID
   * @param eventID
   */
  getSingleEvent(orgaID: string, eventID: string): Observable<OrganizationEventModel> {
    return this.http.get<OrganizationEventModel>(
      BACKEND_API + 'api/v1/organization/' + orgaID + '/event/' + eventID
    )
  }

  /**
   * get the role of the logged in user for one event with the status of the event
   * @param orgId
   * @param eventId
   */
  getUserRoleAndEventStatus(orgId: string, eventId: string): Observable<EventRoleStatusModel> {
    return this.http.get<EventRoleStatusModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/rolestatus',
      httpOptions
    )
  }

  /**
   * get the status of one event in one org
   * @param orgId
   * @param eventId
   */
  getEventStatus(orgId: string, eventId: string): Observable<EventStatusModel> {
    return this.http.get<EventStatusModel>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/status',
      httpOptions
    )
  }

  /**
   * set the status of one event in one org to given status by ID
   * @param orgId
   * @param eventId
   * @param statusId
   */
  setEventStatus(orgId: string, eventId: string, statusId: number) : Observable<any>{
    return this.http.put<any>(
      BACKEND_API + "api/v1/organization/" + orgId + "/event/" + eventId + '/status',
      {
        headers: {'Content-Type': 'application/json'},
        'id': statusId,
        'status': this.mapStatusIdToString(statusId),
      }
    )
  }

  /**
   * map a status ID to the right string value
   * @param id
   */
  mapStatusIdToString(id: number): string {
    if (id == 1) {
      return 'erstellt';
    } else if (id == 2) {
      return 'freigegeben';
    } else if (id == 3) {
      return 'gestartet';
    } else if (id == 4) {
      return 'beendet';
    } else if (id == 5) {
      return 'abgesagt';
    } else if (id == 6) {
      return 'gelöscht';
    } else {
      return 'error';
    }
  }

  /**
   * save one event template by ID in one org
   * @param orgId
   * @param id
   * @param template
   */
  putEventTemplateBasedOnId(orgId: string, id: string, template: EventTemplatePrefillModel): Observable<any> {
    return this.http.put<any>(
      BACKEND_API + "api/v1/organization/" + orgId + "/eventtemplate/" + id,
      template,
      {
        headers: {'Content-Type': 'application/json'}
      }
    )
  }

  safeExistingEventAsTemplate(orgId : string, eventId : string) : Observable<HttpResponse<any>> {
    return this.http.post<any>(
      BACKEND_API + 'api/v1/organization/' + orgId + '/event/' + eventId + '/template',
      {},
      {
        observe: 'response',
        headers: {'Content-Type': 'application/json'},
      }
    )
  }
}
