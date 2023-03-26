import { Component } from '@angular/core';
import {Location} from "@angular/common";
import {DataService} from "../../../services/DataService";
import {UserAtEventModel} from "../../../models/UserAtEventModel";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-event-user-mangament',
  templateUrl: './event-user-mangament.component.html',
  styleUrls: ['./event-user-mangament.component.scss']
})
export class EventUserMangamentComponent {

  attendees : UserAtEventModel[] = [];

  orgId : string = '';
  eventId : string = '';

  constructor(private location : Location, private dataService : DataService) {

    const regex = /\/\d+\//g;
    const matches = this.location.path().match(regex);
    if (matches) {
      const nums = matches.map(match => match.replace(/\//g, ""));

      this.orgId = nums[0];
      this.eventId = nums[1];
    }

    this.dataService.getUserMangamnetList(this.orgId, this.eventId).subscribe(success => {
      this.attendees = success;
    })

  }


  updateList(i: number, $event: MatCheckboxChange) {
    console.log(i, $event.checked)
    this.attendees[i].here = $event.checked;
  }

  sendChanges() {
    this.dataService.saveUserMangamnetList(this.orgId, this.eventId, this.attendees).subscribe(console.log)
  }
}
