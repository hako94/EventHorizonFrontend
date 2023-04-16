import { Component } from '@angular/core';
import {StorageService} from "../../services/StorageService";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  constructor(private storageService : StorageService) {
  }

  foundSession() : boolean {
    return this.storageService.getUser() != null;
  }

  abmelden() : void {
    this.storageService.clear()
    window.location.reload();
  }

  getUserEmail() : string {
    return this.storageService.getEmail()
  }
}
