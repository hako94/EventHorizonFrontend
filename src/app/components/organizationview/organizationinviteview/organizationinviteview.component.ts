import {Component, Input} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationInviteModel} from "../../../models/OrganizationInviteModel";
import {UserRoleModel} from "../../../models/UserRoleModel";

@Component({
  selector: 'app-organizationinviteview',
  templateUrl: './organizationinviteview.component.html',
  styleUrls: ['./organizationinviteview.component.scss']
})
export class OrganizationinviteviewComponent {

  editMode : boolean = false;
  editedUser : string = '';
  email : string = '';
  role : string = '';

  @Input() orgaID = '';

  invitedUsers : OrganizationInviteModel[] = [
    new class implements OrganizationInviteModel {
      email: string = 'local.test1@test.de';
      id: string = 'blablubb-ID';
      role: UserRoleModel = new class implements UserRoleModel {
        id: number = 4;
        role: string = 'teilnehmer';
      };
    },
    new class implements OrganizationInviteModel {
      email: string = 'local.test2@test.de';
      id: string = '222-ID';
      role: UserRoleModel = new class implements UserRoleModel {
        id: number = 5;
        role: string = 'gast';
      };
    }
  ];

  constructor(private dataService : DataService) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationInvites(this.orgaID).subscribe(success => {
      //this.invitedUsers = success;
    })
  }

  changeInviteRole(inviteId : string, email : string, asRole : string) {
    this.dataService.changeOrganizationInviteRole(this.orgaID, inviteId, email, asRole).subscribe(success => {
      console.log(success)
      window.location.reload();
    });
  }

  deleteInvite(inviteId : string) {
    this.dataService.deleteOrganizationInvite(this.orgaID, inviteId).subscribe(success => {
      console.log(success)
      window.location.reload();
    });
  }

  edit(id: string) {
    if (!this.editMode) {
      this.editMode = true;
      this.editedUser = id;
    } else {
      this.editMode = false;
      this.editedUser = '';
    }
  }
}
