import {Component, Input} from '@angular/core';
import {CreateEventModel} from "../../../models/CreateEventModel";
import {DataService} from "../../../services/DataService";
import {Location} from "@angular/common";
import {AddEventCustomField} from "../../../dataobjects/AddEventCustomField";
import {isEmpty, range} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EventTemplateModel} from "../../../models/EventTemplateModel";
import {VariableTemplate} from "../../../models/VariableTemplate";
import {AvailableTemplateList} from "../../../models/AvailableTemplateList";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-organization-addevent',
  templateUrl: './organization-addevent.component.html',
  styleUrls: ['./organization-addevent.component.scss']
})
export class OrganizationAddeventComponent {

  range = new FormGroup({
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date()),
  });

  currentOrganization : string = '';

  availableTemplates : AvailableTemplateList[] = []

  customFields : Array<AddEventCustomField> = [];
  customFieldData : Array<string> = [];

  form : any = {
    eventname : null,
    description : null,
    eventStart : null,
    eventStop : null,
    starttime: null,
    endtime: null,
    location : null,
  }

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

    this.dataService.getAvailableTemplates(this.currentOrganization).subscribe(success => {
      this.availableTemplates = success;
    })
  }

  firstDateChanged(event: any) {
    this.form.eventStart = event.value;
  }

  secondDateChanged(event: any) {
    this.form.eventStop = event.value;
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

  onSubmit() : void {

    const events = `${this.form.eventStart.toISOString().slice(0, 10), this.form.starttime}`
    const evente = `${this.form.eventStop.toISOString().slice(0, 10), this.form.endtime}`

    const model : CreateEventModel = {
      name: this.form.eventname,
      description: this.form.description,
      eventStart: events,
      eventEnd: evente,
      location: this.form.location,
      organisatorId: ["sadasd"]
    }

    this.dataService.postEventInOrganization(this.currentOrganization,model).subscribe(sucess => {
      console.log(sucess)

      this.location.back();
    })
  }

  loadTemplate(value: string) {
    this.dataService.loadTemplate(this.currentOrganization,value).subscribe(success => {
        success.variables.forEach(template => {
          this.customFields.push({id: this.customFields.length.toString(), name: template.name})
        })
      }
    )
  }

  onSubmitTemplate(name : string) {
    const variableTemplate : Array<VariableTemplate> = []

    this.customFields.forEach(field => {
      variableTemplate.push({name: field.name, label: field.name})
    })

    const submitedTemplate : EventTemplateModel = {
        name: name,
        organizationId: this.currentOrganization,
        variables: variableTemplate
    }

    this.dataService.safeTemplate(this.currentOrganization, submitedTemplate).subscribe(success => {
      console.log(success)
    })
  }

  onFileSelected(event : any) {

    const file:File = event.target.files[0];

    if (file) {

      const formData = new FormData();

      formData.append("thumbnail", file);

      //const upload$ = this.http.post("/api/thumbnail-upload", formData);

      //upload$.subscribe();
    }
  }

  goBack() : void {
    this.location.back()
  }
}
