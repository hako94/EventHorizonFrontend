import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {take, toArray} from "rxjs";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-organizationeventview',
  templateUrl: './organization-event-view.component.html',
  styleUrls: ['./organization-event-view.component.scss']
})
export class OrganizationEventViewComponent implements OnInit{

  @Input() orgaID = '';


  selectedTyp: string = '' ;
  selected = '';

  events : OrganizationEventModel[] = [];

  filteredEvents : OrganizationEventModel[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  searchText: string = '';


  constructor(private dataService : DataService) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationEvents(this.orgaID).subscribe(success => {
      this.events = success;
      this.defaultFilter()
    })
  }

  onFilterChange() : void {

    console.log(this.range.controls["start"].value + " - " + this.range.controls['end'].value)

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

    if (this.selectedTyp == 'single') {
      this.filteredEvents = this.filteredEvents.filter(val => { return !val.serial && val.parentId == null })
    }
    if (this.selectedTyp == 'multi') {
      this.filteredEvents = this.filteredEvents.filter(val => { return val.serial })
    }

    this.filteredEvents = this.filteredEvents.slice(0,10);
  }

  defaultFilter() : void {
    this.filteredEvents = this.events.slice(0,10);
  }
}
