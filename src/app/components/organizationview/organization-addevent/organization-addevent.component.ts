import {Component, Input} from '@angular/core';
import {CreateEventModel} from "../../../models/CreateEventModel";
import {DataService} from "../../../services/DataService";
import {Location} from "@angular/common";
import {AddEventCustomField} from "../../../dataobjects/AddEventCustomField";
import {isEmpty} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-organization-addevent',
  templateUrl: './organization-addevent.component.html',
  styleUrls: ['./organization-addevent.component.scss']
})
export class OrganizationAddeventComponent {

  currentOrganization : string = '';

  customFields : Array<AddEventCustomField> = [];
  customFieldData : Array<string> = [];

  form : any = {
    eventname : null,
    description : null
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

  constructor(private dataService : DataService, private location : Location) {

    this.customFields.push({ id: "1", name: "test"})
    this.customFields.push({ id: "2", name: "test1"})
    this.customFields.push({ id: "3", name: "test2"})
  }

  onSubmit() : void {

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

    const model : CreateEventModel = {
      name: this.form.eventname,
      description: this.form.description,
      eventStart: "2023-11-23T05:17:23.399Z",
      eventEnd: "2023-11-23T05:17:23.399Z",
      location: "sad",
      organisatorId: ["sadasd"]
    }

    this.dataService.postEventInOrganization(this.currentOrganization,model).subscribe(sucess => {
      console.log(sucess)
    })
  }
}
