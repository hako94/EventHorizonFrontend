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
   * Gibt zurück, ob eine aktive Session gefunden wurde
   */
  foundSession() : boolean {
    return this.storageService.getUser() != null;
  }

  /**
   * Beendet die aktuelle Session, wodurch der Nutzer vom Frontend abgemeldet wird
   */
  abmelden() : void {
    this.storageService.clear()
    window.location.reload();
  }

  /**
   * Gibt die Email-Adresse des Frontend-Benutzers zurück
   */
  getUserEmail() : string {
    return this.storageService.getEmail()
  }

  /**
   * Gibt zurück, ob es sich beim Benutzer um einen Plattform-Admin handelt,
   * der sich auf dem Dashboard befindet
   */
  isLoggedInPlatformAdmin() : boolean {
    return ((this.storageService.isPlattformAdmin())) && (this.router.url == '/dashboard');
  }
}
