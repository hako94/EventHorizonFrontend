import { Injectable } from '@angular/core';
import {StorageService} from "./StorageService";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme : string = 'alternate';
  constructor(private storageService : StorageService) { }

  switchTheme() : void {
    if (this.theme == 'alternate') {
      this.theme = 'default'
      this.storageService.safeColor('default');
    } else {
      this.theme = 'alternate'
      this.storageService.safeColor('alternate');
    }
  }
}
