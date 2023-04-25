import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationUserModel} from "../../../models/OrganizationUserModel";
import {StorageService} from "../../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-organizationmemberview',
  templateUrl: './organizationmemberview.component.html',
  styleUrls: ['./organizationmemberview.component.scss']
})

/**
 *
 *
 *
 */
export class OrganizationmemberviewComponent implements OnInit{
  selectedRole : number = -1;
  invitedEmail : string = '';
  invitedUser : string = '';

  @Input() orgaID = '';

  members : OrganizationUserModel[] = [];
  selected: any = 'guest';
  editMode : boolean = false;
  editedUser : string = '';

  inviteLoading : boolean = false;

  constructor(private dataService : DataService, private storageService : StorageService, private snackBar : MatSnackBar) {

  }

  ngOnInit(): void {
    this.members = [];
    this.dataService.getOrganizationMember(this.orgaID).subscribe(success => {

      success.forEach(member => {
        if (member.vorname != null && member.nachname != null) {
            this.members.push(member)
          }
      });
    });
  }

  inviteSubmit() : void {
    this.inviteLoading = true;
    console.log(this.selected)
    this.dataService.inviteUser(this.invitedEmail, this.orgaID, this.selected).subscribe(success => {
      this.invitedUser = success;
      this.snackBar.open('Einladung erfolgreich versendet', 'OK', {duration: 3000});
      this.inviteLoading = false;
    }, error => {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
      this.inviteLoading = false;
    })
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

  saveMemberRole(orgId: string, userId: string, role: number){
    this.dataService.changeOrganizationMemberRole(orgId, userId, role).subscribe(() => {
      this.ngOnInit();
      this.snackBar.open('Rolle erfolgreich geändert', 'OK', {duration: 3000});
    }, error => {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
    })
    this.editMode = false;
    this.editedUser = '';
    this.selectedRole = -1;
  }

  deleteMember(userId: string) {
    this.dataService.deleteOrganizationMember(this.orgaID, userId).subscribe(() => {
      this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
      this.ngOnInit();
    }, error => {
      this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
    });
  }
}
