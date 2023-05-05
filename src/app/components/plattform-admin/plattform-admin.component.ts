import {Component} from '@angular/core';
import {DataService} from "../../services/DataService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../services/StorageService";
import {Router} from "@angular/router";
import {DeletionConfirmationComponent} from "../deletion-confirmation/deletion-confirmation.component";
import {MatDialog} from "@angular/material/dialog";

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

  orgaName: string = '';
  orgaAdminMail: string = '';
  orgaDescription: string = '';
  toDeleteOrga: string = '';

  constructor(private dataService: DataService, private snackBar: MatSnackBar, private storageService: StorageService, private router: Router, private dialog : MatDialog) {
    if (!this.storageService.isPlattformAdmin()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  ngOnInit(): void {

  }

  /**
   * Calls the DataService to create an Organization
   */
  createOrganization() {
    if (this.orgaName == '' || this.orgaAdminMail == '') {
      this.snackBar.open('Bitte füllen Sie die Pflichtfelder aus', 'OK', {duration: 3000});
    } else {
      this.dataService.createOrganization(this.orgaName, this.orgaAdminMail, this.orgaDescription).subscribe(() =>
          this.snackBar.open('Organisation ' + this.orgaName + ' erstellt', 'OK', {duration: 3000})
        , () => {
          console.log("Organisation konnte nicht angelegt werden.")
        })
    }
    console.log(this.orgaName);
    console.log(this.orgaAdminMail);
    console.log(this.orgaDescription);

    this.orgaName = '';
    this.orgaAdminMail = '';
    this.orgaDescription = '';
  }

  /**
   * Calls the DataService to delete the selected Organization
   */
  deleteOrga(orgId: string) {
    if (orgId == '') {
      this.snackBar.open('Bitte geben Sie eine Organisations-ID an', 'OK', {duration: 3000});
    } else {
      const dialogRef = this.dialog.open(DeletionConfirmationComponent,{});
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dataService.deleteOrganization(orgId).subscribe(() => this.snackBar.open('Organisation gelöscht', 'OK', {duration: 3000}));
        }
      });
      this.toDeleteOrga = '';
    }
  }

  /**
   * Calls the DataService to delete all entries of the database
   */
  clearDB() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent,{});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteDatabase().subscribe(() => this.snackBar.open('Datenbank geleert', 'OK', {duration: 3000}));
      }
    });
  }

  /**
   * Calls the DataService to re-initialize the database
   */
  resetDB() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent,{});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.resetDatabase().subscribe(() => this.snackBar.open('Datenbank zurückgesetzt', 'OK', {duration: 3000}));
      }
    });
  }
}
