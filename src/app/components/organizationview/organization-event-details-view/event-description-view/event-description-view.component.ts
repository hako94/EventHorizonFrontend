import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {DomSanitizer} from "@angular/platform-browser";
import {OrganizationEventModel} from "../../../../models/OrganizationEventModel";
import {StorageService} from "../../../../services/StorageService";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventPutModel} from "../../../../models/EventPutModel";
import {ChildEvent} from "../../../../models/ChildEventModel";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-event-description-view',
  templateUrl: './event-description-view.component.html',
  styleUrls: ['./event-description-view.component.scss']
})
export class EventDescriptionViewComponent implements OnInit {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent: number = 99;

  editMode : boolean = false;
  multiEvent : boolean = false;
  imageToPersist? : FormData;

  shownimage: any;
  eventModel? : OrganizationEventModel;

  locationNew : string = '';
  descriptionNew : string = '';
  nameNew : string = '';

  singleStartTime: string = '';
  singleEndTime: string = '';
  minDate = new Date();
  singleStartDate = new FormControl(new Date());
  singleEndDate = new FormControl(new Date());

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
      this.multiEvent = false;
      this.eventModel = el
      if (this.eventModel) {
        if (this.eventModel.serial && this.eventModel.eventRepeatScheme == null) {
          this.multiEvent = true;
        }
      }
      console.warn(this.eventModel);
      this.nameNew = this.eventModel.name;
      this.locationNew = this.eventModel.location;
      this.descriptionNew = this.eventModel.description;

      if (this.eventModel.pictureId) {
        this.dataService.getFileForEvent(this.orgaID, this.eventModel?.pictureId || 'error', this.eventID).subscribe(success => {

          let objectURL = URL.createObjectURL(success.body);
          this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        }, error => {
          this.fetchOrgImage();
          console.warn("Cant fetch Image for OrgID " + this.orgaID + " EventID " + this.eventID + " : " + error.status + " using default Organization Image")
        })
      } else {
        this.fetchOrgImage();
      }
    })
  }

  fetchOrgImage() {
    this.dataService.getOrganizationInfos(this.orgaID).subscribe(success => {
      if (success.logoId) {
        this.dataService.getImage(this.orgaID, success.logoId).subscribe(success => {

          let objectURL = URL.createObjectURL(success);
          this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        })
      }
    })
  }

  onEventImageFileSelected(event: any) {

    const fileReader = new FileReader();
    const file:File = event.target.files[0];

    if (file) {

      console.log(file)

      const formData = new FormData();
      formData.append("file", file, file.name);

      let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

      if (allowedExtensions.exec(file.name)) {
        this.snackBar.open('Bild hochgeladen', 'OK', {duration: 3000});
        this.imageToPersist = formData;
      } else {
        this.snackBar.open('Fehler: Es dürfen nur Bilder hochgeladen werden', 'OK', {duration: 3000});
      }
    }
  }

  setStatus(id: number){
    if(id == 4) { //beenden
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data: {message: 'Wollen Sie das Event wirklich beenden?', buttonText: {ok: 'Ja, Beenden'}}});
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dataService.setEventStatus(this.orgaID, this.eventID, id).subscribe(success => {
            console.log(success);
            this.snackBar.open('Event-Status auf beendet gesetzt', 'OK', {duration: 3000});
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
            this.roleIdInEvent = 12;
            this.eventModel.attender = true;
            this.snackBar.open('Erfolgreich für die Teilnahme am Event eingetragen', 'OK', {duration: 3000});
          }
        }
      });
  }

  signOff() {
    this.dataService.leaveEvent(this.orgaID, this.eventID || '', this.storageService.getEmail())
      .subscribe(success => {
        if (success.status == 204) {
          if (this.eventModel) {
            this.roleIdInEvent = 99;
            this.eventModel.attender = false;
            this.snackBar.open('Erfolgreich von der Teilnahme am Event abgemeldet', 'OK', {duration: 3000});
          }
        }
      });
  }

  acceptInvite() {
    this.dataService.acceptEventInvite(this.orgaID, this.eventID).subscribe(success => {
      this.snackBar.open('Einladung erfolgreich angenommen', 'OK', {duration: 3000});
      window.location.reload();
    })
  }

  declineInvite() {
    this.dataService.declineEventInvite(this.orgaID, this.eventID).subscribe(success => {
      this.snackBar.open('Einladung erfolgreich abgelehnt', 'OK', {duration: 3000});
      window.location.reload();
    })
  }

  protected readonly event = event;
  protected readonly Date = Date;

  safeAndPersist() {

    if (this.descriptionNew == '' || this.nameNew == '' || this.locationNew == '') {
      this.snackBar.open('Bitte alle Felder ausfüllen', 'OK', {duration: 3000});
      return;
    }

    if (this.eventModel) {
      console.log(this.eventModel.childs)
      let eventUpdate : EventPutModel = {
        id: this.eventModel.id,
        name: this.nameNew,
        description: this.descriptionNew,
        location: this.locationNew,
        childs: this.eventModel.childs,
        serial: this.eventModel.serial,
        eventStatus: this.eventModel.eventStatus,
        eventRepeatScheme: this.eventModel.eventRepeatScheme
      }
      this.dataService.setEventUpdate(this.orgaID, this.eventID, eventUpdate).subscribe(() => {
        console.log(eventUpdate)
        this.snackBar.open('Änderungen erfolgreich gespeichert', 'OK', {duration: 3000});
        this.ngOnInit()
      });
    }

    if (this.imageToPersist) {
      this.dataService.storeEventImage(this.imageToPersist, this.orgaID, this.eventID).subscribe(() => {
        this.ngOnInit()
      })
    }
    this.editMode = false;
  }

  protected readonly window = window;
  protected readonly parent = parent;

  safeAsTemplate() {
    this.dataService.safeExistingEventAsTemplate(this.orgaID, this.eventID).subscribe(() => {
      this.snackBar.open('Event als Vorlage gespeichert', 'OK', {duration: 3000});
    })
  }

  /**
   * Checks if current user has specified role in current organization
   *
   * @param roleId
   */
  hasRole(roleId: number): boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }

  deleteSerialChild(index: number) {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data: {message: 'Wollen Sie diesen Einzel-Termin wirklich aus der Serie entfernen?'}});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        let newChilds : ChildEvent[] = [];
        let i = 0;
        this.eventModel?.childs.forEach(child => {
          if(i != index) {
            newChilds.push(child);
          }
          i++;
        })
        if (this.eventModel) {
          this.eventModel.childs = newChilds;
          if (this.eventModel.eventRepeatScheme) {
            this.eventModel.eventRepeatScheme.repeatTimes = this.eventModel.eventRepeatScheme.repeatTimes -1;
          }
        }
      }
    });
  }

  attachTimeToDate(date: FormControl<Date | null>, time: string) {

    let hours = Number(time.split(':').at(0));
    let minutes = Number(time.split(':').at(1));

    if (hours) {
      date.value?.setHours(hours);
    }
    if (minutes) {
      date.value?.setMinutes(minutes)
    }
  }
}
