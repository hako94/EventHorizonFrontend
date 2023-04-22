import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationUserModel} from "../../../models/OrganizationUserModel";
import {StorageService} from "../../../services/StorageService";

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

  constructor(private dataService : DataService, private storageService : StorageService) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationMember(this.orgaID).subscribe(success => {
      console.log(success[0].id)

      this.members = success;
      console.log(this.hasRole(1));
      console.log(this.hasRole(2));
    })
  }

  inviteSubmit() : void {
    console.log(this.selected)
    this.dataService.inviteUser(this.invitedEmail, this.orgaID, this.selected).subscribe(success => {
      this.invitedUser = success;
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
    this.dataService.changeOrganizationMemberRole(orgId, userId, role);
    this.editMode = false;
    this.editedUser = '';
    this.selectedRole = -1;
  }

  deleteMember(userId: string) {
    this.dataService.deleteOrganizationMember(this.orgaID, userId);
  }
}
