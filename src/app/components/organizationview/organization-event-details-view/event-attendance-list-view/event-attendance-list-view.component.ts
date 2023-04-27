import {Component, Input, SimpleChange} from '@angular/core';
import {UserAtEventModel} from "../../../../models/UserAtEventModel";
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-attendance-list-view',
  templateUrl: './event-attendance-list-view.component.html',
  styleUrls: ['./event-attendance-list-view.component.scss']
})
export class EventAttendanceListViewComponent {
  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;
  attendee: UserAtEventModel[] = [];

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    if (this.roleIdInEvent == 12) {
      this.router.navigate(['/organizations/' + this.orgaID + '/event/' + this.eventID + '/details'], {queryParams: {view: 'description'}});
    }
    this.attendee = [];
    this.dataService.getAttendeesWithPresence(this.orgaID, this.eventID).subscribe(success => {
      success.forEach(attender => {
        if (attender.vorname != null && attender.nachname != null) {
          this.attendee.push(attender)
        }
      });
    });
  }


  /**
   * sets boolean value for attendance correct and sends update via data service
   * @param event
   * @param attenderId
   */
  saveAttendeeList(event: MatCheckboxChange, attenderId: string): void {
    const editedAttenderIndex = this.attendee.findIndex(i => i.id === attenderId);
    this.attendee[editedAttenderIndex].here = event.checked;
    this.dataService.saveAttendeesWithPresence(this.orgaID, this.eventID, this.attendee).subscribe();
  }
}
