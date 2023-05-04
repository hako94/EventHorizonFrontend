import {Component, Input} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationInviteModel} from "../../../models/OrganizationInviteModel";
import {StorageService} from "../../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-organizationinviteview',
  templateUrl: './organizationinviteview.component.html',
  styleUrls: ['./organizationinviteview.component.scss']
})
export class OrganizationinviteviewComponent {
  selectedRole : number = -1;
  editMode : boolean = false;
  editedUser : string = '';
  email : string = '';
  role : string = '';

  @Input() orgaID = '';

  invitedUsers : OrganizationInviteModel[] = [];

  constructor(private dataService : DataService, private storageService : StorageService, private snackBar : MatSnackBar) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationInvites(this.orgaID).subscribe(success => {
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
    this.dataService.changeOrganizationInviteRole(this.orgaID, inviteId, roleId).subscribe(success => {
      console.log(success)
      this.ngOnInit();
      this.snackBar.open('Rolle erfolgreich geändert', 'OK', {duration: 3000});
    }, error => {
    });
  }

  /**
   * Calls the DataService to delete a specific invitation
   *
   * @param inviteId
   */
  deleteInvite(inviteId : string) {
    this.dataService.deleteOrganizationInvite(this.orgaID, inviteId).subscribe(success => {
      console.log(success)
      this.ngOnInit();
      this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
    }, error => {
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
  }
}
