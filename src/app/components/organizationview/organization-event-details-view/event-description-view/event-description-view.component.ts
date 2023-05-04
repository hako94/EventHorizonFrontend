import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {DomSanitizer} from "@angular/platform-browser";
import {OrganizationEventModel} from "../../../../models/OrganizationEventModel";

@Component({
  selector: 'app-event-description-view',
  templateUrl: './event-description-view.component.html',
  styleUrls: ['./event-description-view.component.scss']
})
export class EventDescriptionViewComponent implements OnInit {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;

  shownimage: any;
  eventModel? : OrganizationEventModel;

  constructor(private dataService : DataService, private sanitizer : DomSanitizer) {

  }

  ngOnInit(): void {
    this.dataService.getSingleEvent(this.orgaID, this.eventID).subscribe(el => {

      this.eventModel = el

      this.dataService.getFileForEvent(this.orgaID, this.eventModel?.pictureId || 'error', this.eventID).subscribe(success => {

        let objectURL = URL.createObjectURL(success);
        this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      }, error => {

        console.warn("Cant fetch Image for OrgID " + this.orgaID + " EventID " + this.eventID +  " : " + error.status + " using default Organization Image")

        this.dataService.getOrganizationInfos(this.orgaID).subscribe(success => {

          this.dataService.getImage(this.orgaID, success.logoId).subscribe(success => {

            let objectURL = URL.createObjectURL(success);
            this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          })
        })
      })

    });
  }

  setStatus(id: number){
    this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {
      console.log(success);
    })
    window.location.reload();
  }

  protected readonly event = event;
  protected readonly Date = Date;
}
