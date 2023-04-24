import {Component, Input} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventInviteModel} from "../../../../models/EventInviteModel";

@Component({
  selector: 'app-event-invites-view',
  templateUrl: './event-invites-view.component.html',
  styleUrls: ['./event-invites-view.component.scss']
})
export class EventInvitesViewComponent {

  selectedRole : number = -1;
  editMode : boolean = false;
  editedUser : string = '';
  email : string = '';
  role : string = '';

  @Input() orgaID = '';
  @Input() eventID = '';

  invitedUsers : EventInviteModel[] = [];

  constructor(private dataService : DataService, private storageService : StorageService, private snackBar : MatSnackBar) {

  }

  ngOnInit(): void {
    this.dataService.getEventInvites(this.orgaID, this.eventID).subscribe(success => {
      this.invitedUsers = success;
      console.log(this.invitedUsers);
    })
  }

  /**
   * Calls DataService to change the role of a specified invitation
   *
   * @param inviteId
   * @param roleId
   */
  changeInviteRole(inviteId : string, roleId : number) {
    this.dataService.changeEventInviteRole(this.orgaID, this.eventID, inviteId, roleId).subscribe(success => {
      console.log(success)
      this.ngOnInit();
      this.snackBar.open('Rolle erfolgreich geändert', 'OK', {duration: 3000});
    }, error => {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
    });
  }

  /**
   * Calls the DataService to delete a specific invitation
   *
   * @param inviteId
   */
  deleteInvite(inviteId : string) {
    this.dataService.deleteEventInvite(this.orgaID, this.eventID, inviteId).subscribe(success => {
      console.log(success)
      this.ngOnInit();
      this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
    }, error => {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
    });
  }

  /**
   * Changes between 'edit' and 'view' mode of the table
   *
   * @param id
   */
  edit(id: string) {
    if (!this.editMode) {
      this.editMode = true;
      this.editedUser = id;
    } else {
      this.changeInviteRole(id, this.selectedRole)
      this.editMode = false;
      this.editedUser = '';
      this.selectedRole = -1;
    }
  }

  /**
   * Checks if frontend-user has the specified role
   *
   * @param roleId
   */
  hasRole(roleId: number) : boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
    //TODO: Prüfen, ob derjenige im Event entsprechende Rechte hat (->Excel Tabelle)
  }
}