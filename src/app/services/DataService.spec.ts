import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DataService} from './DataService';
import {OrganizationModel} from '../models/OrganizationModel';
import {OrganizationEventModel} from '../models/OrganizationEventModel';
import {CreateEventModel} from '../models/CreateEventModel';
import {OrganizationUserModel} from '../models/OrganizationUserModel';
import {EventTemplateModel} from '../models/EventTemplateModel';
import {AvailableTemplateList} from '../models/AvailableTemplateList';
import {ChatHistoryModel} from '../models/ChatHistoryModel';
import {EventQuestionnairesModel} from '../models/EventQuestionnairesModel';
import {UserAtEventModel} from '../models/UserAtEventModel';
import {environment} from '../../environments/environment';
import {UserRoleModel} from "../models/UserRoleModel";
import {ChildEvent} from "../models/ChildEventModel";

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const BACKEND_API = environment.backendApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve organizations', () => {
    const dummyOrganizations: OrganizationModel[] = [{id: "1", name: "test", description: "test", logoId: "1"}];

    service.getOrganizations().subscribe((organizations) => {
      expect(organizations).toEqual(dummyOrganizations);
    });

    const req = httpMock.expectOne(BACKEND_API + 'api/v1/organizations');
    expect(req.request.method).toBe('GET');
    req.flush(dummyOrganizations);
  });

  it('should retrieve organization events', () => {
    const orgId = 'dummyOrgId';
    const dummyOrganizationEvents: OrganizationEventModel[] = [{
      id : '123',
      name : 'testname',
      description : 'testbeschreibung',
      childs : [{
        childId : '456',
        eventStart : '219203',
        eventEnd : '23456',
      }],
      parentId : '789',
      serial : false,
      location: 'hier',
      pictureId: 'tz76',
      organizationId : '654',
      organisator : true,
      tutor : false,
      attender : false,
    }];

    service.getOrganizationEvents(orgId).subscribe((events) => {
      expect(events).toEqual(dummyOrganizationEvents);
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organization/${orgId}/events`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyOrganizationEvents);
  });

  it('should post event in organization', () => {
    const orgId = 'dummyOrgId';
    const dummyCreateEventModel: {} = {};

    service.postEventInOrganizationAndPersist(orgId, {
      name: "hello",
      description: "hello",
      eventStart: "1",
      eventEnd: "2",
      location: "here",
      organisatorId: [orgId]
    }).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organization/${orgId}/events`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should retrieve organization members', () => {
    const orgId = '123';

    const mockResponse: OrganizationUserModel[] = [
      {
        id: '1',
        email: 'email@email.de',
        vorname: 'Max',
        nachname: 'Mustermann',
        role: {id: 1, role: 'admin'}
      },
      {
        id: '1',
        email: 'email@email.de',
        vorname: 'Max',
        nachname: 'Mustermann',
        role: {id: 1, role: 'admin'}
      }
    ];

    service.getOrganizationMember(orgId).subscribe((members: string | any[]) => {
      expect(members.length).toBe(2);
      expect(members).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organization/${orgId}/members`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should invite user', () => {
    const email = 'test@example.com';
    const orgId = '123';
    const asRole = 'admin';
    const mockResponse = 'success';

    service.inviteUser(email, orgId, asRole).subscribe((result) => {
      expect(result).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/authenticatedUser/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({email, organizationId: orgId, asRole});
    req.flush(mockResponse);
  });

  it('should load event template', () => {
    const orgId = '123';
    const templateId = '456';
    const mockResponse: EventTemplateModel = {
      name: templateId,
      organizationId: orgId,
      variables: [{name: 'one', label: 'two'}]
    };

    service.loadTemplate(orgId, templateId).subscribe((template) => {
      expect(template).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organization/${orgId}/events/eventtemplates/${templateId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should save event template', () => {
    const orgId = '123';
    const template: EventTemplateModel = {name: '123', organizationId: orgId, variables: [{name: 'one', label: 'two'}]};
    const mockResponse: EventTemplateModel = {
      name: '456',
      organizationId: orgId,
      variables: [{name: 'one', label: 'two'}]
    };

    service.safeTemplate(orgId, template).subscribe((savedTemplate) => {
      expect(savedTemplate).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organization/${orgId}/events/eventtemplates`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(template);
    req.flush(mockResponse);
  });


  it('should store file successfully', () => {
    const orgId = 'orgId';
    const formData = new FormData();
    const response = {status: 'success'};

    service.storeFile(formData, orgId).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.backendApi}api/v1/files?orgId=${orgId}`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should get image successfully', () => {
    const orgId = 'orgId';
    const fileId = 'fileId';
    const response = new Blob();

    service.getImage(orgId, fileId).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.backendApi}api/v1/files/${fileId}?orgId=${orgId}`);
    expect(req.request.method).toBe('GET');
    req.flush(response, {headers: {'Content-Type': 'image/jpeg'}});
  });

  it('should get available templates successfully', () => {
    const orgaId = 'orgaId';
    const response: AvailableTemplateList[] = [{id: '1', name: 'Template 1'}, {id: '2', name: 'Template 2'}];

    service.getAvailableTemplates(orgaId).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.backendApi}api/v1/organization/${orgaId}/events/eventtemplates`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('should get organization infos successfully', () => {
    const orgId = 'orgId';
    const response: OrganizationModel = {id: '1', name: 'Organization 1', description: 'hello', logoId: 'logo'};

    service.getOrganizationInfos(orgId).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.backendApi}api/v1/organization/${orgId}`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('should accept event successfully', () => {
    const orgId = 'orgId';
    const eventId = 'eventId';
    const userId = 'userId';
    const response = {status: 'success'};

    service.acceptEvent(orgId, eventId, userId).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(
      `${environment.backendApi}api/v1/organization/${orgId}/event/${eventId}/book?email=${userId}`
    );
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should delete an event', () => {
    const orgId = 'orgId';
    const eventId = 'eventId';

    service.deleteEvent(orgId, eventId).subscribe();

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organizations/${orgId}/events/${eventId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should leave an event', () => {
    const orgId = 'orgId';
    const eventId = 'eventId';
    const userId = 'userId';

    service.leaveEvent(orgId, eventId, userId).subscribe();

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organization/${orgId}/event/${eventId}/signoff?email=${userId}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should create event questionnaires', () => {
    const orgId = 'orgId';
    const eventId = 'eventId';
    const eventQuestionnairesModel: EventQuestionnairesModel = {
      id: orgId,
      title: 'hello',
      description: 'description',
      questions: [],
      eventId: eventId
    };

    service.createEventQuestionnaires(orgId, eventId, eventQuestionnairesModel).subscribe();

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organizations/${orgId}/events/${eventId}/questionnaires`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(eventQuestionnairesModel);
    req.flush({});
  });

  it('should load available event questionnaires', () => {
    const orgId = 'orgId';
    const eventId = 'eventId';

    service.loadAvailableEventQuestionnaires(orgId, eventId).subscribe();

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organizations/${orgId}/events/${eventId}/questionnaires`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get chat history', () => {
    const orgId = 'orgId';
    const eventId = 'eventId';

    service.getChatHistory(orgId, eventId).subscribe();

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/organizations/${orgId}/events/${eventId}/chat`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get user management list', () => {
    const orgId = 'org123';
    const eventId = 'event456';
    const expectedUrl = `${BACKEND_API}api/v1/organizations/${orgId}/events/${eventId}/attendees`;

    const expectedUsers: UserAtEventModel[] = [
      {id: 'user1', email: 'test@test.de', vorname: 'Max', nachname: 'Mustermann', here: true},
      {id: 'user2', email: 'test1@test.de', vorname: 'Olaf', nachname: 'Mustermann', here: false},
    ];

    service.getUserManagementList(orgId, eventId).subscribe(users => {
      expect(users).toEqual(expectedUsers);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(expectedUsers);
  });

  it('should save user management list', () => {
    const orgId = 'org123';
    const eventId = 'event456';
    const users: UserAtEventModel[] = [
      {id: 'user1', email: 'test@test.de', vorname: 'Max', nachname: 'Mustermann', here: true},
      {id: 'user2', email: 'test1@test.de', vorname: 'Olaf', nachname: 'Mustermann', here: false},
    ];
    const expectedUrl = `${BACKEND_API}api/v1/organizations/${orgId}/events/${eventId}/attendees`;

    service.saveUserManagementList(orgId, eventId, users).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(users);

    req.flush({});
  });
});
