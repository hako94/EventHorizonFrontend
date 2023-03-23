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

  @Input() orgaID = '';

  members : OrganizationUserModel[] = [];

  constructor(private dataService : DataService) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationMember(this.orgaID).subscribe(success => {
      console.log(success[0].userId)

      this.members = success;
    })
  }


  inviteSubmit() : void {
    this.dataService.inviteUser(this.invitedEmail, this.orgaID).subscribe(success => {
      console.log(success)
    })
  }



}
