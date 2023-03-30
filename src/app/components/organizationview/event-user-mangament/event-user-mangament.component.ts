import {Component, ElementRef} from '@angular/core';
import {Location} from "@angular/common";
import {DataService} from "../../../services/DataService";
import {UserAtEventModel} from "../../../models/UserAtEventModel";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {animate, AnimationBuilder, keyframes, state, style, transition, trigger} from "@angular/animations";
import {finalize} from "rxjs";

@Component({
  selector: 'app-event-user-mangament',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        width: '140px',
        opacity: 0.8,
      })),
      state('finished', style({
        width: '140px',
        opacity: 0.8,
      })),
      state('closed', style({
        width: '100px',
        opacity: 1,
      })),
      transition('open => finished', [
        animate('1s')
      ]),
      transition('finished => closed', [
        animate('0.1s')
      ]),
      transition('closed => open', [
        animate('0.1s')
      ]),
    ]),
  ],
  templateUrl: './event-user-mangament.component.html',
  styleUrls: ['./event-user-mangament.component.scss']
})
export class EventUserMangamentComponent {

  attendees : UserAtEventModel[] = [];

  orgId : string = '';
  eventId : string = '';
  loading: boolean = false;
  done : boolean = false;
  private element: ElementRef;
  animationState: string = 'closed';

  constructor(private location : Location,
              private dataService : DataService,
              private animationBuilder: AnimationBuilder,
              private elRef : ElementRef) {

    const regex = /\/organizations\/(\w+)\/event\/(\w+)\//;
    const matches = regex.exec(location.path());
    if (matches) {
      const nums = matches.map(match => match.replace(/\//g, ""));

      this.orgId = nums[1];
      this.eventId = nums[2];
    }

    this.dataService.getUserMangamnetList(this.orgId, this.eventId).subscribe(success => {
      this.attendees = success;
    })

    this.element = elRef;
  }


  updateList(i: number, $event: MatCheckboxChange) {
    console.log(i, $event.checked)
    this.attendees[i].here = $event.checked;
  }

  sendChanges() {
    this.animationState = "open";
    this.loading = true;
    this.dataService.saveUserMangamnetList(this.orgId, this.eventId, this.attendees).subscribe(success => {
    this.animationState = "finished"
      this.loading = false;
      setTimeout(() => {
        this.animationState = "closed"
      }, 2000)
    }, error => {
      this.loading = false;
      this.animationState = "closed"
      console.log(error)
    })
  }
}
