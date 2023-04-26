import {Component, Input} from '@angular/core';
import {UserAtEventModel} from "../../../../models/UserAtEventModel";
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserForEventWithRoleModel} from "../../../../models/UserForEventWithRoleModel";

@Component({
  selector: 'app-event-attender-view',
  templateUrl: './event-attender-view.component.html',
  styleUrls: ['./event-attender-view.component.scss']
})
export class EventAttenderViewComponent {
  @Input() orgaID = '';
  @Input() eventID = '';

  ownRoleInOrg : number = -1;
  attendee : UserForEventWithRoleModel[] = [];
  editMode : boolean = false;
  editedUser : string = '';
  selectedRole : number = 12;

  constructor(private dataService: DataService, private storageService: StorageService, private snackBar: MatSnackBar) {
  }
  ngOnInit(): void {
    this.attendee = [];
    this.dataService.getAttendeesWithRole(this.orgaID, this.eventID).subscribe(success => {
      success.forEach(attender => {
        if (attender.vorname != null && attender.nachname != null) {
          this.attendee.push(attender)
        }
      });
    });
    this.ownRoleInOrg = this.storageService.getRoleInCurrentOrganization(this.orgaID);
  }


  /**
   * Checks if current user has specified role in current organization
   *
   * @param roleId
   */
  hasRole(roleId: number) : boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }

  enableEdit(id: string) {
    if (!this.editMode) {
      this.editMode = true;
      this.editedUser = id;
    }
  }

  saveAttenderRole(orgId: string, attenderId: string, role: number){
    console.log("saved new role " + role + "for attender " + attenderId);
    this.dataService.saveAttenderRole(orgId, this.eventID, attenderId, role).subscribe(() => {
      this.ngOnInit();
      this.snackBar.open('Rolle erfolgreich geändert', 'OK', {duration: 3000});
    }, error => {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
    })
    this.editMode = false;
    this.editedUser = '';
    this.selectedRole = 12;
  }

  deleteAttender(attenderId: string) {
    console.log("deleted attender " + attenderId);
    //this.dataService.deleteOrganizationMember(this.orgaID, userId).subscribe(() => {
    //  this.snackBar.open('Teilnehmer abgemeldet', 'OK', {duration: 3000});
    //  this.ngOnInit();
    //}, error => {
    //  this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
    //});
  }
}
