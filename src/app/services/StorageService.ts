import { Injectable } from '@angular/core';
import {LoginResponse} from "../models/LoginResponse";
import {UserOrganizationModel} from "../models/UserOrganizationModel";
import {RefreshResponse} from "../models/RefreshResponse";


const SESSION_STORAGE_KEY = "auth-user";
const REFRESH_STORAGE_KEY = "refresh-token";
const EMAIL_STORAGE_KEY = "auth-user_email";
const CSRF_KEY = "XSRF-TOKEN";
const ORGANIZATIONS_STORAGE_KEY = "auth-orgs";
const PLATTFORMADMIN_STORAGE_KEY = "admin";
const USER_ID_STORAGE_KEY = "auth-user_id";
const COLOR = "color";

@Injectable({
  providedIn: 'root'
})

/**
 * Save and load information for the current frontend user session
 */
export class StorageService {
  constructor() {}

  /**
   * clears session storage
   */
  clear(): void {
    window.sessionStorage.clear();
  }

  /**
   * sets new value for email key in session storage
   * @param email
   */
  public saveEmail(email : string) {
    window.sessionStorage.removeItem(EMAIL_STORAGE_KEY)
    window.sessionStorage.setItem(EMAIL_STORAGE_KEY, email)
  }

  public safeColor(color : string) {
    window.sessionStorage.removeItem(COLOR)
    window.sessionStorage.setItem(COLOR, color)
  }

  public getColor() : string {
    return window.sessionStorage.getItem(COLOR) || 'alternate';
  }

  /**
   * gets value of email key from session storage
   */
  public getEmail() : string {
    return window.sessionStorage.getItem(EMAIL_STORAGE_KEY) || '';
  }

  /**
   * sets new value for user ID in session storage
   * @param id
   */
  public saveUserId(id : string) {
    window.sessionStorage.removeItem(USER_ID_STORAGE_KEY)
    window.sessionStorage.setItem(USER_ID_STORAGE_KEY, id)
  }

  /**
   * gets user ID from session storage
   */
  public getUserId() : string {
    return window.sessionStorage.getItem(USER_ID_STORAGE_KEY) || '';
  }

  /**
   * sets new value for admin key in session storage
   * @param bool
   */
  public savePlattformAdmin(bool : string) {
    window.sessionStorage.removeItem(PLATTFORMADMIN_STORAGE_KEY)
    window.sessionStorage.setItem(PLATTFORMADMIN_STORAGE_KEY, String(bool))
  }

  /**
   * gets boolean value if admin key is set in session storage
   */
  public isPlattformAdmin() : boolean {
    const platformAdmin : string | null = window.sessionStorage.getItem(PLATTFORMADMIN_STORAGE_KEY);
    return platformAdmin == '1';
  }

  /**
   * saves org ID and role in the org in session storage
   * @param list
   */
  public saveOrganizationList(list: UserOrganizationModel): void {
    const json = JSON.stringify(list);
    window.sessionStorage.setItem(ORGANIZATIONS_STORAGE_KEY, json);
  }

  /**
   * gets the value of the org and the status from session storage
   */
  public getOrganizationList(): UserOrganizationModel[] | null {
    const json = window.sessionStorage.getItem(ORGANIZATIONS_STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  }

  /**
   * gets the role in the currently chosen organization for the logged in user
   * @param orgId
   */
  public getRoleInCurrentOrganization(orgId: string): number {
    let userOrganizationModels : UserOrganizationModel[] | null = this.getOrganizationList();
    if (userOrganizationModels == null) {
      return 0;
    }
    for (let i = 0; i < userOrganizationModels.length; i++) {
      if (userOrganizationModels[i].orgId == orgId) {
        return userOrganizationModels[i].role.id;
      }
    }
    return 4;
  }

  /**
   * saves csrf key for security in session storage
   * @param key
   */
  public saveCsrfKey(key : string) : void {
    window.sessionStorage.removeItem(CSRF_KEY)
    window.sessionStorage.setItem(CSRF_KEY, key);
  }

  /**
   * gets the csrf key for security from session storage
   */
  public getCsrfKey() : string | null{
    const key = window.sessionStorage.getItem(CSRF_KEY);
    if (key) {
      return key;
    }
    return null;
  }

  /**
   * sets new session and refresh key in session storage after login
   * @param loginResponse
   */
  public saveUser(loginResponse: LoginResponse): void {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    window.sessionStorage.removeItem(REFRESH_STORAGE_KEY);
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, loginResponse.token.toString());
    window.sessionStorage.setItem(REFRESH_STORAGE_KEY, loginResponse.refreshToken.toString());
  }

  /**
   * gets user session key from session storage
   */
  public getUser(): String | null{
    const user = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (user) {
      return user;
    }
    return null;
  }

  /**
   * sets new session and refresh key in session storage when refreshed
   * @param refreshResponse
   */
  public saveRefreshSession(refreshResponse: RefreshResponse): void {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    window.sessionStorage.removeItem(REFRESH_STORAGE_KEY);
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, refreshResponse.accessToken.toString());
    window.sessionStorage.setItem(REFRESH_STORAGE_KEY, refreshResponse.refreshToken.toString());
  }

  /**
   * gets the refresh token from session storage
   */
  public getRefreshToken(): string | null{
    const token = window.sessionStorage.getItem(REFRESH_STORAGE_KEY);
    if (token) {
      return token;
    }
    return null;
  }

  /**
   * checks if session key is set in session storage
   */
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}
