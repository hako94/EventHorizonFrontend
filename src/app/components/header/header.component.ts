import { Component } from '@angular/core';
import {StorageService} from "../../services/StorageService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  protected readonly sessionStorage = sessionStorage;

  constructor(private storageService : StorageService, private router : Router) {
  }

  /**
   * Returns if an active session has been found
   */
  foundSession() : boolean {
    return this.storageService.getUser() != null;
  }

  /**
   * Terminates current session and current user gets logged out
   */
  abmelden() : void {
    this.storageService.clear()
    window.location.reload();
  }

  /**
   * Returns mail address of frontend user
   */
  getUserEmail() : string {
    return this.storageService.getEmail()
  }

  /**
   * Returns if current user is platform admin and on the dashboard component
   */
  isLoggedInPlatformAdmin() : boolean {
    return ((this.storageService.isPlattformAdmin())) && (this.router.url == '/dashboard');
  }
}
