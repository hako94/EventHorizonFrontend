import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationUserModel} from "../../../models/OrganizationUserModel";

@Component({
  selector: 'app-organizationmemberview',
  templateUrl: './organizationmemberview.component.html',
  styleUrls: ['./organizationmemberview.component.scss']
})
export class OrganizationmemberviewComponent implements OnInit{

  invitedEmail : string = '';
  invitedUser : string = '';

  @Input() orgaID = '';

  members : OrganizationUserModel[] = [];
  selected: any = 'guest';

  constructor(private dataService : DataService) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationMember(this.orgaID).subscribe(success => {
      console.log(success[0].userId)

      this.members = success;
    })
  }


  inviteSubmit() : void {
    console.log(this.selected)
    this.dataService.inviteUser(this.invitedEmail, this.orgaID, this.selected).subscribe(success => {
      this.invitedUser = success;
    })
  }

}
