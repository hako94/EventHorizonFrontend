import { Injectable } from '@angular/core';
import {LoginResponse} from "../models/LoginResponse";

const SESSION_STORAGE_KEY = "auth-user";
const CSRF_KEY = "XSRF-TOKEN";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clear(): void {
    window.sessionStorage.clear();
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
