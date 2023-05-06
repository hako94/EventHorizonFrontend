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

  selectedStatus: number | null = null;
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
      this.defaultFilter();
      console.log(this.filteredEvents);
    })
  }

  onFilterChange(): void {

    let startTimeFilter = this.range.controls['start'].value?.valueOf()!;
    let endTimeFilter = this.range.controls['end'].value?.valueOf()! + 8.64e+7;
    console.log(this.range.controls['start'].value + " - " + this.range.controls['end'].value);

    this.filteredEvents = this.events.slice();

    if (startTimeFilter != undefined && endTimeFilter != undefined) {
      this.filteredEvents = this.filteredEvents.filter(event => {
        if (!event.serial && event.parentId == null){
          let childStart = new Date(event.childs[0].eventStart).valueOf();
          let childEnd = new Date(event.childs[0].eventEnd).valueOf();
          return (startTimeFilter <= childStart && childEnd <= endTimeFilter)
        } else {
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

    if (this.selectedStatus == 0) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val
      })
    }
    if (this.selectedStatus == 1) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.eventStatus.id == 1
      })
    }
    if (this.selectedStatus == 2) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.eventStatus.id == 2
      })
    }
    if (this.selectedStatus == 3) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.eventStatus.id == 3
      })
    }
    if (this.selectedStatus == 4) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.eventStatus.id == 4
      })
    }
    if (this.selectedStatus == 5) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.eventStatus.id == 5
      })
    }
    if (this.selectedStatus == 6) {
      this.filteredEvents = this.filteredEvents.filter(val => {
        return val.eventStatus.id == 6
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
