import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './AuthService';
import {environment} from "../../environments/environment";

//const BACKEND_AUTH_API = 'http://localhost:8080/api/v1/auth/'
//const BACKEND_AUTH_API = 'https://eventhorizonbackend.azurewebsites.net/api/v1/auth/';

const BACKEND_AUTH_API =  environment.authApi;

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should log in a user', () => {
    //given
    const email = 'test@example.com';
    const password = 'testpassword';
    const expectedResponse = { token: 'testtoken' };
    //when
    authService.login(email, password).subscribe((response: any) => {
      //then
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_AUTH_API}login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.flush(expectedResponse);
  });

  it('should register a user', () => {
    //given
    const email = 'test@example.com';
    const password = 'testpassword';
    const expectedResponse = {};
    //when
    authService.register(email, password).subscribe((response: any) => {
      //then
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_AUTH_API}register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });
    req.flush(expectedResponse);
  });

  // funktioniert noch nicht richtig‚ da die Parameter nicht richtig übergeben werden
  // it('should register a user with additional parameters', () => {
  //   //given
  //   const email = 'test@example.com';
  //   const password = 'testpassword';
  //   const first_name = 'John';
  //   const last_name = 'Doe';
  //   const userIdEmail = 'testuser';
  //   const orgaId = 'testorga';
  //   const userModel = 'testmodel';
  //   const expectedResponse = {};
  //   //when
  //   authService.registerWithLink(email, password, first_name, last_name, userIdEmail, orgaId, userModel).subscribe((response) => {
  //     //then
  //     expect(response).toEqual(expectedResponse);
  //   });
  //
  //   const req = httpMock.expectOne(`${BACKEND_AUTH_API}register`);
  //   expect(req.request.method).toBe('POST');
  //   expect(req.request.body).toEqual({ email, password, first_name, last_name });
  //   expect(req.request.params.get('newUser')).toBe('true');
  //   expect(req.request.params.get('UserIdEmail')).toBe(userIdEmail);
  //   expect(req.request.params.get('OrganizationId')).toBe(orgaId);
  //   expect(req.request.params.get('createdUserModel')).toBe(userModel);
  //   req.flush(expectedResponse);
  // });

  it('should log out a user', () => {
    //given
    const expectedResponse = {};
    //when
    authService.logout().subscribe((response: any) => {
      //then
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(`${BACKEND_AUTH_API}signout`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });
});
