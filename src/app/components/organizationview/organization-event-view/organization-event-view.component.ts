import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {take, toArray} from "rxjs";

@Component({
  selector: 'app-organizationeventview',
  templateUrl: './organization-event-view.component.html',
  styleUrls: ['./organization-event-view.component.scss']
})
export class OrganizationEventViewComponent implements OnInit{

  @Input() orgaID = '';

  selected = '';

  events : OrganizationEventModel[] = [];
  filteredEvents : OrganizationEventModel[] = [];

  constructor(private dataService : DataService) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationEvents(this.orgaID).subscribe(success => {
      this.events = success;
      this.defaultFilter()
    })
  }

  onFilterChange() : void {
    this.filteredEvents = this.events.slice();

    if (this.selected  == 'attende') {
      this.filteredEvents = this.filteredEvents.filter(val => { return val.attender})
    }
    if (this.selected  == 'noattende') {
      this.filteredEvents = this.filteredEvents.filter(val => { return !val.attender})
    }
    if (this.selected  == 'organizer') {
      this.filteredEvents = this.filteredEvents.filter(val => { return val.organisator})
    }
    if (this.selected  == 'tutor') {
      this.filteredEvents = this.filteredEvents.filter(val => { return val.tutor})
    }

    this.filteredEvents = this.filteredEvents.slice(0,5);
  }

  defaultFilter() : void {
    this.filteredEvents = this.events.slice(0,5);
  }
}
