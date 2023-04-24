import {Component, Input} from '@angular/core';
import {UserAtEventModel} from "../../../../models/UserAtEventModel";
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";

@Component({
  selector: 'app-event-attender-view',
  templateUrl: './event-attender-view.component.html',
  styleUrls: ['./event-attender-view.component.scss']
})
export class EventAttenderViewComponent {
  @Input() orgaID = '';
  @Input() eventID = '';

  ownRoleInOrg : number = -1;
  attendee : UserAtEventModel[] = [];

  constructor(private dataService: DataService, private storageService: StorageService) {
  }
  ngOnInit(): void {
    this.attendee = [];
    this.dataService.getUserManagementList(this.orgaID, this.eventID).subscribe(success => {
      success.forEach(attender => {
        if (attender.vorname != null && attender.nachname != null) {
          this.attendee.push(attender)
        }
      });
    });
    this.ownRoleInOrg = this.storageService.getRoleInCurrentOrganization(this.orgaID);
  }
}
