import { Component } from '@angular/core';
import {DataService} from "../../services/DataService";
import {StorageService} from "../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-plattform-admin',
  templateUrl: './plattform-admin.component.html',
  styleUrls: ['./plattform-admin.component.scss']
})

/**
 * Einstellungen-Seite für Plattformbetreiber zum Anlegen und löschen von Orgas sowie zum droppen der DB
 *
 * @author Maximilian
 * @version 1
 * @since
 */
export class PlattformAdminComponent {
  //TODO: Im header.component.ts die Anzeigelogik umkehren (das ! bei isPlatformAdmin wegmachen)

  toDeleteOrga : string = '';

  constructor(private dataService : DataService, private snackBar : MatSnackBar) {
  }

  ngOnInit(): void {

  }

  /**
   * Calls the DataService to delete the selected Organization
   */
  deleteOrga(orgId : string) {
    if (orgId == '') {
      this.snackBar.open('Bitte geben Sie eine Organisations-ID an', 'OK', {duration: 3000});
    } else {
      this.dataService.deleteOrganization(orgId);
      this.toDeleteOrga = '';
    }
  }

  /**
   * Calls the DataService to delete all entries of the database
   */
  clearDB() {
    this.dataService.deleteDatabase();
  }

  /**
   * Calls the DataService to re-initialize the database
   */
  resetDB() {
    this.dataService.resetDatabase();
  }
}
