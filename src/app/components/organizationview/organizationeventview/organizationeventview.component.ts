import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {EventPerOrganizationModel} from "../../../models/EventPerOrganizationModel";

@Component({
  selector: 'app-organizationeventview',
  templateUrl: './organizationeventview.component.html',
  styleUrls: ['./organizationeventview.component.scss']
})
export class OrganizationeventviewComponent implements OnInit{

  @Input() orgaID = '';

  data : EventPerOrganizationModel[] = [];

  constructor(private dataService : DataService) {

  }

  ngOnInit(): void {
    this.dataService.getEventsPerOrganization(this.orgaID).subscribe(success => {
      this.data = success;
    })
  }



}
