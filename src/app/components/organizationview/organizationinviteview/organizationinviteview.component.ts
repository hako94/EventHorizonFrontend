import {Component, Input} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationInviteModel} from "../../../models/OrganizationInviteModel";

@Component({
  selector: 'app-organizationinviteview',
  templateUrl: './organizationinviteview.component.html',
  styleUrls: ['./organizationinviteview.component.scss']
})
export class OrganizationinviteviewComponent {

  email : string = '';
  role : string = '';

  @Input() orgaID = '';

  invitedUsers : OrganizationInviteModel[] = [];

  constructor(private dataService : DataService) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationInvites(this.orgaID).subscribe(success => {
      this.invitedUsers = success;
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
}
