import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CsrfService } from './CsrfService';
import {environment} from "../../environments/environment";

//const BACKEND_API = 'http://localhost:8080/'
//const BACKEND_API = "https://eventhorizonbackend.azurewebsites.net/";
const BACKEND_API = environment.backendApi
describe('CsrfService', () => {
  let service: CsrfService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CsrfService],
    });
    service = TestBed.inject(CsrfService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve CSRF token successfullyn', () => {
    //given
    const expectedCsrfToken = 'CsfrToken';
    //when
    service.getCsrf().subscribe((response: { csrfToken: any; }) => {
      //then
      expect(response.csrfToken).toEqual(expectedCsrfToken);
    });

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/security/csrf`);
    expect(req.request.method).toBe('GET');
    req.flush({ csrfToken: expectedCsrfToken });
  });

  it('should throw an error on failed request', () => {
    //given
    const errorMsg = 'Fehler bei der Anfrage';
    //when
    service.getCsrf().subscribe(
      () => {},
      (error: { error: any; }) => {
        //then
        expect(error).toBeTruthy();
        expect(error.error).toEqual(errorMsg);
      }
    );

    const req = httpMock.expectOne(`${BACKEND_API}api/v1/security/csrf`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error', { message: errorMsg }));
  });
});
