import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OrganizationEventModel} from "../../../models/OrganizationEventModel";
import {SocketService} from "../../../services/SocketService";
import {Message} from "@stomp/stompjs";
import {DataService} from "../../../services/DataService";
import {StorageService} from "../../../services/StorageService";
import {ChatModel} from "../../../models/ChatModel";
import {DatePipe} from "@angular/common";
import {ImageGetServiceService} from "../../../services/image-get-service.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";


@Component({
  selector: 'app-event',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit {
  shownimage: any;

  @Input() orgEvent?: OrganizationEventModel;
  @Input() orgId: string = '';

  @Input() mock: boolean = false;

  constructor(private storageService: StorageService,
              private dataService: DataService,
              private imageService: ImageGetServiceService,
              private sanitizer: DomSanitizer,
              private router: Router) {
  }

  ngOnInit(): void {

    if (this.orgEvent) {

      if(this.orgEvent.pictureId == null) {

        this.dataService.getOrganizationInfos(this.orgId).subscribe(success => {

          this.dataService.getImage(this.orgId, success.logoId).subscribe(success => {

            let objectURL = URL.createObjectURL(success);
            this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          })
        })

      } else {

        this.dataService.getFileForEvent(this.orgId, this.orgEvent.pictureId, this.orgEvent.id).subscribe(success => {

          let objectURL = URL.createObjectURL(success);
          this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        }, error => {

          console.warn("Cant fetch Image for OrgID " + this.orgId + " EventID " + this.orgEvent + " : " + error.status + " using default Organization Image")

          this.dataService.getOrganizationInfos(this.orgId).subscribe(success => {

            this.dataService.getImage(this.orgId, success.logoId).subscribe(success => {

              let objectURL = URL.createObjectURL(success);
              this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            })
          })
        })
      }
    }
  }

  book() {
    this.dataService.acceptEvent(this.orgId, this.orgEvent?.id || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 200) {
          if (this.orgEvent) {
            this.orgEvent.attender = true;
          }
        }
      });
  }

  signOff() {
    this.dataService.leaveEvent(this.orgId, this.orgEvent?.id || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 204) {
          if (this.orgEvent) {
            this.orgEvent.attender = false;
          }
        }
      });
  }

  //DANGER ZONE

  deleteEvent() {
    if (this.orgEvent?.id) {

      console.log("eid " + this.orgEvent.id + " orgId " + this.orgId)

      this.dataService.deleteEvent(this.orgId, this.orgEvent.id).subscribe(success => {
        console.log(success)
        window.location.reload()
      })

    }
  }

  /**
   * routes to the details component of the selected event
   */
  routeToEventDetails() {
    // @ts-ignore
    this.router.navigate(['/organizations/' + this.orgId + '/event/' + this.orgEvent.id + '/details'], {queryParams: {view: 'description'}});
  }
}
