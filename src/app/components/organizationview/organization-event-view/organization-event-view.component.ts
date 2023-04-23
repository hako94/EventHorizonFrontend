import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";

@Component({
  selector: 'app-organizationeventview',
  templateUrl: './organization-event-view.component.html',
  styleUrls: ['./organization-event-view.component.scss']
})
export class OrganizationEventViewComponent implements OnInit{

  @Input() orgaID = '';

  events : OrganizationEventModel[] = [];
  filteredEvents : OrganizationEventModel[] = [];

  constructor(private dataService : DataService) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationEvents(this.orgaID).subscribe(success => {
      this.events = success;
      this.filteredEvents = [... this.events];
    })
  }


  filter() : void {

  }
}
