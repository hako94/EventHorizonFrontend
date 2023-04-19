import { Component } from '@angular/core';

@Component({
  selector: 'app-plattform-admin',
  templateUrl: './plattform-admin.component.html',
  styleUrls: ['./plattform-admin.component.scss']
})

/**
 * Einstellungen-Seite für Plattformbetreiber zum Anlegen und löschen von Orgas sowie zum droppen der DB
 */
export class PlattformAdminComponent {
  //TODO: Im header.component.ts die Anzeigelogik umkehren (das ! bei isPlatformAdmin wegmachen)

  /** Aufruf des DataService, um die gewählte Organisation zu löschen.
   *
   */
  deleteOrga() {

  }

  /**
   * Aufruf des DataService, um alle Einträge der Datenbank zu löschen.
   */
  clearDB() {

  }

  /**
   * Aufruf des DataService, um die Datenbank zurückzusetzen und mit Testdaten zu befüllen.
   */
  resetDB() {

  }
}
