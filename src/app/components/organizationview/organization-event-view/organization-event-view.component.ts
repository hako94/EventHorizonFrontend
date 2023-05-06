import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {FormControl, FormGroup} from "@angular/forms";
import {StorageService} from "../../../services/StorageService";

@Component({
  selector: 'app-organizationeventview',
  templateUrl: './organization-event-view.component.html',
  styleUrls: ['./organization-event-view.component.scss']
})
export class OrganizationEventViewComponent implements OnInit {

  @Input() orgaID = '';


  selectedTyp: string = '';
  selected = '';

  events: OrganizationEventModel[] = [];

  filteredEvents: OrganizationEventModel[] = [];

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  searchText: string = '';


  constructor(private dataService: DataService, private storageStorage: StorageService) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationEvents(this.orgaID).subscribe(success => {
      this.events = success;
      this.defaultFilter()
    })
  }

  onFilterChange(): void {

    let startTimeFilter = this.range.controls['start'].value?.valueOf()!;
    let endTimeFilter = this.range.controls['end'].value?.valueOf()! + 8.64e+7;
    console.log(this.range.controls['start'].value + " - " + this.range.controls['end'].value);
    console.log('start: ' + startTimeFilter);
    console.log('ende: ' + endTimeFilter);

    this.filteredEvents = this.events.slice();

    if (startTimeFilter != undefined && endTimeFilter != undefined) {
      console.log('time filter');
      this.filteredEvents = this.filteredEvents.filter(event => {
        if (!event.serial && event.parentId == null){
          let childStart = new Date(event.childs[0].eventStart).valueOf();
          let childEnd = new Date(event.childs[0].eventEnd).valueOf();
          return (startTimeFilter <= childStart && childEnd <= endTimeFilter)
        } else {
          console.log('serial')
          let childStart = new Date(event.childs[0].eventStart).valueOf();
          let childEnd = new Date(event.childs[event.childs.length-1].eventEnd).valueOf();
          console.log(childEnd);
          return (startTimeFilter <= childStart && childEnd <= endTimeFilter)
        }
      })
    }


    if (this.selected == 'attende') {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.attender
      })
    }
    if (this.selected == 'noattende') {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return !val.attender
      })
    }
    if (this.selected == 'organizer') {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.organisator
      })
    }
    if (this.selected == 'tutor') {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.tutor
      })
    }

    if (this.selectedTyp == 'single') {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return !val.serial && val.parentId == null
      })
    }
    if (this.selectedTyp == 'multi') {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.serial
      })
    }

    this.filteredEvents = this.filteredEvents.slice(0, 50);
  }

  defaultFilter(): void {
    this.filteredEvents = this.events.slice(0, 50);
  }

  /**
   * Checks if the frontend user is orga-admin or organizer
   */
  hasAddEventRights(): boolean {
    return (this.storageStorage.getRoleInCurrentOrganization(this.orgaID) == 1) || (this.storageStorage.getRoleInCurrentOrganization(this.orgaID) == 2);
  }
}
