import {Component} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {Location} from "@angular/common";
import {AddEventCustomField} from "../../../dataobjects/AddEventCustomField";
import {delay, forkJoin, min, Observable, of, Subscription} from "rxjs";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {EventTemplateModel} from "../../../models/EventTemplateModel";
import {AvailableTemplateList} from "../../../models/AvailableTemplateList";
import {Router} from "@angular/router";
import {ChildEvent} from "../../../models/ChildEventModel";
import {EventTemplatePrefillModel} from "../../../models/EventTemplatePrefillModel";
import {EmailTemplateModel} from "../../../models/EmailTemplateModel";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogLoadingComponent} from "./dialog-loading/dialog-loading.component";
import {HttpResponse} from "@angular/common/http";
import {OrganizationUserModel} from "../../../models/OrganizationUserModel";
import {List} from "postcss/lib/list";
import {DeletionConfirmationComponent} from "../../deletion-confirmation/deletion-confirmation.component";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface createInterfaceTemplateBasic {
  eventName : string,
  eventDescription : string,
  location : string,
  eventType : string
}

export interface dateSlotHolder {
  eventStartDate : string,
  eventStartTime : string,
  eventEndDate : string,
  eventEndTime : string
}

export interface eventRepeatScheme {
  repeatTimes : string,
  repeatCycle : number
}

export interface baseModel {
  name : string,
  description : string,
  location : string,
  organisatorId : Array<string>,
  tutorId : Array<string>,
  eventStatus:
    {
      id: number,
      status : string
    }
}

export interface RequestModel extends baseModel{
  serial: boolean
  childs: {
    eventStart : string,
    eventEnd : string
  } []
  eventRepeatScheme? :
    {
      repeatCycle: string,
      repeatTimes: string
    }
}

@Component({
  selector: 'app-organization-addevent',
  templateUrl: './organization-addevent.component.html',
  styleUrls: ['./organization-addevent.component.scss'],
})
export class OrganizationAddeventComponent {

  private dialogRef?: MatDialogRef<DialogLoadingComponent>

  eventCreated : boolean = false;
  pictureUploaded : boolean = false
  filesUploaded : boolean = false

  singleStartTime : string = '';
  singleEndTime : string = '';

  disabledTemplateSafe : boolean = false;

  serialEvent : eventRepeatScheme = {
    repeatTimes: "0",
    repeatCycle: 0
  };

  minDate = new Date();

  singleStartDate = new FormControl(new Date());
  singleEndDate = new FormControl(new Date());

  shownPreviewImage : any;

  imageToPersist? : FormData;
  filesToPersist : FormData[] = [];

  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());

  currentOrganization : string = '';

  emailTemplates: EmailTemplateModel[] = [];
  emailTemplatesInUse : EmailTemplateModel[] = [];
  availableTemplates : AvailableTemplateList[] = []
  eventTemplates : EventTemplateModel[] = [];

  customFields : Array<AddEventCustomField> = [];

  customFieldData : Array<string> = [];

  files : File[] = [];

  form : createInterfaceTemplateBasic = {
    eventName : '',
    eventDescription : '',
    location : '',
    eventType: 'single'
  }

  childs : ChildEvent[] = [];

  members : OrganizationUserModel[] = [];
  organizers : OrganizationUserModel[] = [];

  toAddTutor : OrganizationUserModel[] = [];
  toAddOrganizer : OrganizationUserModel[] = [];

  constructor(private dataService : DataService,
              private location : Location,
              private router : Router,
              public dialog: MatDialog,
              private deleteDialog: MatDialog,
              private snackBar: MatSnackBar) {

    this.customFields.push({ id: "1", name: "test0"})
    this.customFields.push({ id: "2", name: "test1"})
    this.customFields.push({ id: "3", name: "test2"})

    let orga = this.location.path().split('/').at(2)?.toString()

    if (orga) {
      console.log("Orga index " + orga.indexOf('?'))

      if (orga.indexOf('?') > 0) {
        this.currentOrganization = orga.slice(0,orga.indexOf('?'));
      } else {
        this.currentOrganization = orga;
      }
    } else {
      this.currentOrganization = '';
    }

    this.loadTemplates()
    this.loadEmails()
    this.loadMembers();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogLoadingComponent, {
      width: '400px',
      data: { mEventCreated: this.eventCreated, mEventPictureUploaded : this.pictureUploaded, mEventFilesUploaded : this.filesUploaded }
    });
  }

  validateTimeInput(input : string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Regular expression for hh:mm format
    return timeRegex.test(input);
  }

  persistData() : void {

    console.warn(this.singleStartDate.value)

    let model : baseModel = {
      name : this.form.eventName,
      description : this.form.eventDescription,
      location : this.form.location,
      tutorId : this.toAddTutor.map(el => el.id),
      organisatorId : this.toAddOrganizer.map(el => el.id),
      eventStatus:
        {
          id: 1,
          status: "erstellt"
        }
    }

    let modelExtended;

    if (this.form.eventType == "single") {
      if (this.singleStartDate.value != null && this.singleEndDate.value != null) {
        modelExtended = {
          ...model,
          serial: false,
          childs:
            [
              {
                //id: 0, remove ID, may break
                eventStart: this.dateToLocalDateTimeString(this.singleStartDate.value),
                eventEnd: this.dateToLocalDateTimeString(this.singleEndDate.value)
              }
            ]
        }
      }

    } else if (this.form.eventType == "serial") {

      if (this.startDate.value != null && this.endDate.value != null) {
        modelExtended =
          {
            ...model,
            serial: true,
            eventRepeatScheme:
              {
                repeatCycle: "PT"+this.serialEvent.repeatCycle*24+"H",
                repeatTimes: this.serialEvent.repeatTimes
              },
            childs:
              [
                {
                  //id: 0 removedID, may break
                  eventStart: this.dateToLocalDateTimeString(this.startDate.value),
                  eventEnd: this.dateToLocalDateTimeString(this.endDate.value)
                }
              ]
          }
      }
    } else {
      modelExtended =
        {
          ...model,
          serial: true,
          childs: this.childs.map(el => {return {eventStart: el.eventStart, eventEnd: el.eventEnd}})
        }
    }

    this.openDialog();

    this.dataService.postEventInOrganizationAndPersist(this.currentOrganization, modelExtended).pipe(delay(1000)).subscribe(response => {

      if (this.dialogRef) {
        this.dialogRef.componentInstance.data = {
          mEventCreated : { id: 1, description : "" },
          mEventPictureUploaded : { id: 0, description : "" },
          mEventFilesUploaded : { id: 0, description : "" }
        };
      }
      console.log(this.extractIdFromUrl(response.body.toString()))

      this.persistImage(this.extractIdFromUrl(response.body.toString())).pipe(delay(1000)).subscribe(successPersistImage => {

        if (this.dialogRef) {
          this.dialogRef.componentInstance.data = {
            mEventCreated : { id: 1, description : "" },
            mEventPictureUploaded : { id: 1, description : "" },
            mEventFilesUploaded : { id: 0, description : "" }
          };
        }

        this.persistAllFiles(this.currentOrganization, this.extractIdFromUrl(response.body.toString())).pipe(delay(2000)).subscribe(success => {
          console.log("request vollständig + " + success)

          if (this.dialogRef) {
            this.dialogRef.componentInstance.data = {
              mEventCreated : { id: 1, description : "" },
              mEventPictureUploaded : { id: 1, description : "" },
              mEventFilesUploaded : { id: 1, description : "" }
            };
          }

        }, error => {
          this.dialogRef?.close();
        }, ()=> {
          this.router.navigate(['/organizations/' + this.currentOrganization], {queryParams: {view: 'events'}});
        })

      }, error => { this.dialogRef?.close() })
    }, error => { this.dialogRef?.close() });
  }
  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }


  persistImage(id : string) : Observable<any> {
    if (this.imageToPersist) {
      return this.dataService.storeEventImage(this.imageToPersist, this.currentOrganization, id);
    } else {
      console.log(this.filesToPersist)
      return of("default Image");
    }
  }

  persistAllFiles(orgId : string, eventId : string) : Observable<any> {
    if (this.filesToPersist.length > 0) {

      const observables: Observable<any>[] = [];

      for (let i = 0; i < this.filesToPersist.length; i++) {
        observables.push(this.dataService.storeFileForEvent(this.filesToPersist[i], orgId, eventId));
      }

      return forkJoin(observables);
    }
    return of("No files to persist found");
  }

  loadEmails() : void {
    this.dataService.getEmailTemplates(this.currentOrganization).subscribe(templates => {
      this.emailTemplates = templates;
    })
  }

  loadTemplates() {
    this.dataService.loadTemplates(this.currentOrganization).subscribe(templates => {
        this.eventTemplates = templates;
      }
    )
  }

  onFileSelected(event : any) {

    const files : Array<File> = event.target.files;

    console.log(files);

    [...files].forEach(file => {

      if (file) {

        const formData = new FormData();

        formData.append("file", file, file.name);

        this.filesToPersist.push(formData);
      }
    })
  }


  onEventImageFileSelected(event: any) {

    const fileReader = new FileReader();
    const file:File = event.target.files[0];

    if (file) {

      const formData = new FormData();
      formData.append("file", file, file.name);

      this.imageToPersist = formData;

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        this.shownPreviewImage = fileReader.result as string;
      }
    }
  }

  dateToLocalDateTimeString<T extends Date>(date: T): string {
    const dateString : string = `${date.getFullYear()}-${(date.getMonth() + 1).toString()
      .padStart(2, '0')}-${date.getDate().toString()
      .padStart(2, '0')}T${date.getHours().toString()
      .padStart(2, '0')}:${date.getMinutes().toString()
      .padStart(2, '0')}:${date.getSeconds().toString()
      .padStart(2, '0')}`;
    return dateString;
  }

  addChildEvent(eventStart : Date | null, eventEnd : Date | null) : void {
    if (eventStart != null && eventEnd != null) {
      this.childs.push(
        {
          eventStart: this.dateToLocalDateTimeString(eventStart),
          eventEnd: this.dateToLocalDateTimeString(eventEnd)
        }
      )
    }
    console.log(this.childs)
  }

  deleteChildEvent(start: string, end : string) {
    this.childs = this.childs
      .filter(el => {return (el.eventEnd != end || el.eventStart != start)})
      .filter(el => {return el != null})
  }

  goBack() : void {
    const dialogRef = this.deleteDialog.open(DeletionConfirmationComponent,{data: {message: 'Wollen Sie den Vorgang wirklich abbrechen und das Event verwerfen?'}});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.snackBar.open('Event verworfen', 'OK', {duration: 3000});
        this.location.back()
      }
    });
  }

  persistTemplate() {

    this.disabledTemplateSafe = true;

    if (this.form.eventType == "single" && this.singleStartDate != null && this.singleEndDate != null) {

      let template : EventTemplatePrefillModel = {
        name : this.form.eventName,
        description : this.form.eventDescription,
        location : this.form.location,
        eventType : this.form.eventType,
        childs:
          [
            {
              eventStart: this.dateToLocalDateTimeString(this.singleStartDate.value || new Date()),
              eventEnd: this.dateToLocalDateTimeString(this.singleEndDate.value || new Date())
            }
          ],
        serial: (this.childs.length > 1)
      }

      this.dataService.safeTemplate(this.currentOrganization, template).subscribe()

    } else {

      let template : EventTemplatePrefillModel = {
        name : this.form.eventName,
        description : this.form.eventDescription,
        location : this.form.location,
        eventType : this.form.eventType,
        serial: (this.childs.length > 1),
        childs : this.childs.slice(0,1)
      }

      this.dataService.safeTemplate(this.currentOrganization, template).subscribe()

    }
  }

  loadTemplateWithId(id: string) {
    this.dataService.loadTemplateBasedOnId(this.currentOrganization,id).subscribe(template => {
      this.form.eventName = template.name;
      this.form.location = template.location;
      this.form.eventDescription = template.description;

      if (template.childs != null) {
        if (template.childs.length == 1) {
          this.form.eventType = "single";

          this.singleStartDate.setValue(new Date(template.childs[0].eventStart));
          this.singleEndDate.setValue(new Date(template.childs[0].eventEnd))

          this.singleEndTime = (template.childs[0].eventEnd.split('T').at(1) || "0").slice(0, 5);
          this.singleStartTime = (template.childs[0].eventStart.split('T').at(1) || "0").slice(0, 5);

          this.attachTimeToDate(this.singleStartDate, this.singleStartTime);
          this.attachTimeToDate(this.singleEndDate, this.singleEndTime);

        } else if (template.childs.length == 2) {
          this.form.eventType = "multi";

          this.childs = [];

          template.childs.forEach(childDate => {
            this.childs.push(childDate)
          })
        }
      }
    })
  }

  removeValueFromInUseEmails(id: string) {
    this.emailTemplatesInUse = this.emailTemplatesInUse.filter(val => { return val.id != id })
  }

  addValueToInUseEmails(emailTemplate: EmailTemplateModel) {
    if (!this.emailTemplatesInUse.includes(emailTemplate)) {
      this.emailTemplatesInUse.push(emailTemplate);
    }
  }

  protected readonly Number = Number;

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

  private loadMembers() {
    this.dataService.getOrganizationMember(this.currentOrganization).subscribe(data => {
      this.organizers = data.filter(el => (el.role.id == 1 || el.role.id == 2));
      this.members = data.filter(el => !(el.role.id == 1 || el.role.id == 2));
    })
  }

  userIsInList(list : OrganizationUserModel[], id : string) {
    return list.filter(el => el.id == id).length > 0;
  }

  removeOrganizerFromList(id: string) {
    this.toAddOrganizer = this.toAddOrganizer.filter(el => el.id != id)
  }

  removeTutorFromList(id: string) {
    this.toAddTutor = this.toAddTutor.filter(el => el.id != id)
  }

  protected readonly Date = Date;
}
