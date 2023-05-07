import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {DomSanitizer} from "@angular/platform-browser";
import {OrganizationEventModel} from "../../../../models/OrganizationEventModel";
import {StorageService} from "../../../../services/StorageService";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-event-description-view',
  templateUrl: './event-description-view.component.html',
  styleUrls: ['./event-description-view.component.scss']
})
export class EventDescriptionViewComponent implements OnInit {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent: number = 12;

  editMode : boolean = false;
  imageToPersist? : FormData;

  shownimage: any;
  eventModel? : OrganizationEventModel;

  locationNew : string = '';
  descriptionNew : string = '';

  constructor(private dataService : DataService,
              private sanitizer : DomSanitizer,
              private storageService: StorageService,
              private activeRoute : ActivatedRoute,
              private dialog : MatDialog,
              private snackBar : MatSnackBar) {

  }

  ngOnInit(): void {
    this.activeRoute.url.subscribe(url => {
      if (url.at(3)){
        if (url[3].path != this.eventID) {
          this.window.location.reload();
        }
      }
    })

    this.dataService.getSingleEvent(this.orgaID, this.eventID).subscribe(el => {

      this.eventModel = el
      this.locationNew = this.eventModel.location;
      this.descriptionNew = this.eventModel.description;

      this.dataService.getFileForEvent(this.orgaID, this.eventModel?.pictureId || 'error', this.eventID).subscribe(success => {

        let objectURL = URL.createObjectURL(success.body);
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

  onEventImageFileSelected(event: any) {

    const fileReader = new FileReader();
    const file:File = event.target.files[0];

    if (file) {

      console.log(file)

      const formData = new FormData();
      formData.append("file", file, file.name);

      this.imageToPersist = formData;
    }
  }

  setStatus(id: number){
    if(id == 4) { //beenden
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data: {message: 'Wollen Sie das Event wirklich beenden?', buttonText: {ok: 'Ja, Beenden'}}});
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {
            console.log(success);
            this.snackBar.open('Event-Status auf bendet gesetzt', 'OK', {duration: 3000});
            window.location.reload();
          })
        }
      });
    } else if(id == 6) { //löschen
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data: {message: 'Wollen Sie das Event wirklich löschen?'}});
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {
            console.log(success);
            this.snackBar.open('Event-Status auf gelöscht gesetzt', 'OK', {duration: 3000});
            window.location.reload();
          })
        }
      });
    } else if (id == 5) { //absagen
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data: {message: 'Wollen Sie das Event wirklich absagen?', buttonText: {ok: 'Ja, Absagen'}}});
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {
            console.log(success);
            this.snackBar.open('Event-Status auf abgesagt gesetzt', 'OK', {duration: 3000});
            window.location.reload();
          })
        }
      });
    } else {

      this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {
        console.log(success);
        this.snackBar.open('Status erfolgreich geändert', 'OK', {duration: 3000});
        window.location.reload();
      })
    }
  }

  book() {
    this.dataService.acceptEvent(this.orgaID, this.eventID || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 200) {
          if (this.eventModel) {
            this.eventModel.attender = true;
          }
        }
      });
  }

  signOff() {
    this.dataService.leaveEvent(this.orgaID, this.eventID || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 204) {
          if (this.eventModel) {
            this.eventModel.attender = false;
          }
        }
      });
  }

  acceptInvite() {
    this.dataService.acceptEventInvite(this.orgaID, this.eventID).subscribe(success => {
      window.location.reload();
    })
  }

  declineInvite() {
    this.dataService.declineEventInvite(this.orgaID, this.eventID).subscribe(success => {
      window.location.reload();
    })
  }

  protected readonly event = event;
  protected readonly Date = Date;

  safeAndPersist() {
    this.editMode = false;

    if (this.eventModel) {
      this.eventModel.location = this.locationNew;
      this.eventModel.description = this.descriptionNew;
    }

    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data: {message: 'Wollen Sie das Event wirklich löschen?'}});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        //this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {})
      }
    });




    if (this.imageToPersist) {
      this.dataService.storeEventImage(this.imageToPersist, this.orgaID, this.eventID).subscribe(() => window.location.reload())
    }
  }

  protected readonly window = window;
  protected readonly parent = parent;

  safeAsTemplate() {
    this.dataService.safeExistingEventAsTemplate(this.orgaID, this.eventID).subscribe()
  }

  /**
   * Checks if current user has specified role in current organization
   *
   * @param roleId
   */
  hasRole(roleId: number): boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }
}
