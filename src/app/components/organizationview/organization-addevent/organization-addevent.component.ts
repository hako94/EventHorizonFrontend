import {Component, Input} from '@angular/core';
import {CreateEventModel} from "../../../models/CreateEventModel";
import {DataService} from "../../../services/DataService";
import {Location} from "@angular/common";

@Component({
  selector: 'app-organization-addevent',
  templateUrl: './organization-addevent.component.html',
  styleUrls: ['./organization-addevent.component.scss']
})
export class OrganizationAddeventComponent {

  currentOrganization : string = '';

  form : any = {
    eventname : null,
    description : null
  }

  constructor(private dataService : DataService, private location : Location) {

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
