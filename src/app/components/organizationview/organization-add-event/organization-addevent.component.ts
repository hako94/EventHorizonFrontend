import {Component} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {Location} from "@angular/common";
import {AddEventCustomField} from "../../../dataobjects/AddEventCustomField";
import {min, Observable, of} from "rxjs";
import {FormControl} from "@angular/forms";
import {EventTemplateModel} from "../../../models/EventTemplateModel";
import {AvailableTemplateList} from "../../../models/AvailableTemplateList";
import {Router} from "@angular/router";
import {ChildEvent} from "../../../models/ChildEventModel";
import {EventTemplatePrefillModel} from "../../../models/EventTemplatePrefillModel";
import {EmailTemplateModel} from "../../../models/EmailTemplateModel";

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
  styleUrls: ['./organization-addevent.component.scss']
})
export class OrganizationAddeventComponent {

  singleStartTime : string = '';
  singleEndTime : string = '';

  disabledTemplateSafe : boolean = false;

  serialEvent : eventRepeatScheme = {
    repeatTimes: "0",
    repeatCycle: 0
  };

  singleStartDate = new FormControl(new Date());
  singleEndDate = new FormControl(new Date());

  shownPreviewImage : any;

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

  constructor(private dataService : DataService,
              private location : Location,
              private router : Router) {

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
  }
  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  removeValueFromCustomFields(index : number) : void {
    //TODO test: gut möglich das er hier mit den indizes mal durcheinander kommmt
      delete this.customFields[index];
      delete this.customFieldData[index]
      this.customFields = this.customFields.filter(el => {return el != null});
    this.customFieldData = this.customFieldData.filter(el => {return el != null});
  }

  addCustomField(name : string) : void {
    this.customFields.push({ id: this.customFields.length.toString(), name: name})
  }

  updateField(i: number, $event: any) {
    this.customFieldData[i] = $event.target.value;

    console.log(this.customFieldData)
  }

  persistData() : void {

    console.warn(this.singleStartDate.value)

    let model : baseModel = {
      name : this.form.eventName,
      description : this.form.eventDescription,
      location : this.form.location,
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

    this.dataService.postEventInOrganizationAndPersist(this.currentOrganization, modelExtended).subscribe(response => {
      console.log(this.extractIdFromUrl(response.body.toString()))

      this.persistImage(this.extractIdFromUrl(response.body.toString())).subscribe(success => {

        this.persistFiles().subscribe(success => {
          console.log("request vollständig")
        }, error => {
          //TODO rollback
          console.log("konnte die Dateien nicht hochladen")
        }, ()=> {
          console.log("finishing request ...")
          this.router.navigate(['/organizations/' + this.currentOrganization], {queryParams: {view: 'events'}});
        })

      }, error => { console.log(error) })
    });
  }
  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }


  persistImage(id : string) : Observable<any> {
    if (this.filesToPersist.length > 0 && this.filesToPersist.at(0)) {
      return this.dataService.storeEventImage(this.filesToPersist[0], this.currentOrganization, id);
    } else {
      console.log(this.filesToPersist.length + " i " + this.filesToPersist.at(0))
      throw new Error()
    }
  }

  persistFiles() : Observable<any> {
    //TODO unterscheiden zwischen Bild und anderen Dateien
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

    const file:File = event.target.files[0];

    if (file) {

      const formData = new FormData();

      formData.append("file", file, file.name);

      this.filesToPersist.push(formData);
    }
  }

  //TODO unterscheiden

  onEventImageFileSelected(event: any) {

    const fileReader = new FileReader();
    const file:File = event.target.files[0];

    if (file) {

      const formData = new FormData();
      formData.append("file", file, file.name);

      this.filesToPersist.push(formData);

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
          childId: this.childs.length + "",
          eventStart: this.dateToLocalDateTimeString(eventStart),
          eventEnd: this.dateToLocalDateTimeString(eventEnd)
        }
      )
    }
    console.log(this.childs)
  }

  deleteChildEvent(id: string) {
    this.childs = this.childs
      .filter(el => {return el.childId != id})
      .filter(el => {return el != null})
      .map((el, index) => {return { ...el, id: index}})
  }

  goBack() : void {
    this.location.back()
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
        childs : this.childs,
        serial: (this.childs.length > 1)
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

}
