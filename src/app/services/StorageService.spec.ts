import { StorageService } from './StorageService';
import { TestBed } from '@angular/core/testing';
import { LoginResponse } from '../models/LoginResponse';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new StorageService();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('should use saveEmail() to save the email in sessionStorage', () => {
    //given
    const email = 'test@example.com';
    //when
    service.saveEmail(email);
    //then
    expect(window.sessionStorage.getItem('auth-user_email')).toEqual(email);
  });

  it('should use getEmail() to retrieve the email from the sessionStorage', () => {
    //given
    const email = 'test@example.com';
    //when
    window.sessionStorage.setItem('auth-user_email', email);
    //then
    expect(service.getEmail()).toEqual(email);
  });

  it('should use saveCsrfKey() to store the CSRF key in sessionStorage', () => {
    const csrfKey = '1234567890abcdef';
    service.saveCsrfKey(csrfKey);
    expect(window.sessionStorage.getItem('XSRF-TOKEN')).toEqual(csrfKey);
  });

  it('should use getCsrfKey() to retrieve the CSRF key from the sessionStorage', () => {
    const csrfKey = '1234567890abcdef';
    window.sessionStorage.setItem('XSRF-TOKEN', csrfKey);
    expect(service.getCsrfKey()).toEqual(csrfKey);
  });

  it('sollte saveUser() verwenden, um den Benutzer im sessionStorage zu speichern', () => {
    //given
    const loginResponse: { token: string } = { token: 'abcdefg' };
    //when
    service.saveUser(loginResponse);
    //then
    expect(window.sessionStorage.getItem('auth-user')).toEqual(loginResponse.token);
  });

  it('should use getUser() to retrieve the user from the sessionStorage', () => {
    //given
    const loginResponse: { token: string } = { token: 'abcdefg' };
    //when
    window.sessionStorage.setItem('auth-user', loginResponse.token);
    //then
    expect(service.getUser()).toEqual(loginResponse.token);
  });

  it('should use isLoggedIn() to check if a user is logged in', () => {
    //given
    const loginResponse: { token: string } = { token: 'abcdefg' };
    //when
    window.sessionStorage.setItem('auth-user', loginResponse.token);
    //then
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return isLoggedIn() as false if no user is logged in', () => {
    //then
    expect(service.isLoggedIn()).toBe(false);
  });
});
