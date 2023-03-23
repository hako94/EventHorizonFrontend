import { Component } from '@angular/core';
import {DataService} from "../../services/DataService";
import {OrganizationModel} from "../../models/OrganizationModel";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  organizations : OrganizationModel[] = [];
  constructor(private readonly dataService : DataService) {
    dataService.getOrganizations().subscribe(success => {
      console.log("DATA:" + success.at(0)?.name)
      this.organizations = success;
    })
  }




}
