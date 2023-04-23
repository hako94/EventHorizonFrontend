import { Injectable } from '@angular/core';
import {LoginResponse} from "../models/LoginResponse";
import {UserOrganizationModel} from "../models/UserOrganizationModel";


const SESSION_STORAGE_KEY = "auth-user";
const EMAIL_STORAGE_KEY = "auth-user_email";
const CSRF_KEY = "XSRF-TOKEN";
const ORGANIZATIONS_STORAGE_KEY = "auth-orgs";
const PLATTFORMADMIN_STORAGE_KEY = "admin";

@Injectable({
  providedIn: 'root'
})

/**
 * Save and load information for the current frontend user session
 */
export class StorageService {
  constructor() {}

  clear(): void {
    window.sessionStorage.clear();
  }

  public saveEmail(email : string) {
    window.sessionStorage.removeItem(EMAIL_STORAGE_KEY)
    window.sessionStorage.setItem(EMAIL_STORAGE_KEY, email)
  }

  public getEmail() : string {
    return window.sessionStorage.getItem(EMAIL_STORAGE_KEY) || '';
  }

  public savePlattformAdmin(bool : string) {
    window.sessionStorage.removeItem(PLATTFORMADMIN_STORAGE_KEY)
    window.sessionStorage.setItem(PLATTFORMADMIN_STORAGE_KEY, String(bool))
  }

  public isPlattformAdmin() : boolean {
    const platformAdmin : string | null = window.sessionStorage.getItem(PLATTFORMADMIN_STORAGE_KEY);
    return platformAdmin == '1';
  }

  public saveOrganizationList(list: UserOrganizationModel): void {
    const json = JSON.stringify(list);
    window.sessionStorage.setItem(ORGANIZATIONS_STORAGE_KEY, json);
  }

  public getOrganizationList(): UserOrganizationModel[] | null {
    const json = window.sessionStorage.getItem(ORGANIZATIONS_STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  }

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

  public saveCsrfKey(key : string) : void {
    window.sessionStorage.removeItem(CSRF_KEY)
    window.sessionStorage.setItem(CSRF_KEY, key);
  }

  public getCsrfKey() : string | null{
    const key = window.sessionStorage.getItem(CSRF_KEY);
    if (key) {
      return key;
    }
    return null;
  }

  public saveUser(loginResponse: LoginResponse): void {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, loginResponse.token.toString());
  }

  public getUser(): String | null{
    const user = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (user) {
      return user;
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}
