import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {EventTemplateModel} from "../../../models/EventTemplateModel";
import {EventTemplatePrefillModel} from "../../../models/EventTemplatePrefillModel";

@Component({
  selector: 'app-organization-preset-view',
  templateUrl: './organization-preset-view.component.html',
  styleUrls: ['./organization-preset-view.component.scss']
})
export class OrganizationPresetViewComponent implements OnInit{

  @Input()
  orgaID : string = ''

  eventTemplates : EventTemplateModel[] = [];
  eventeTemplatePrefillModel? : EventTemplatePrefillModel;

  isLoading : boolean = false;
  editMode : boolean = false;

  constructor(private dataService : DataService) {
  }

  ngOnInit(): void {
    this.loadTemplates()
  }

  deleteTemplate(templateId : string) {
    this.dataService.deleteTemplate(this.orgaID, templateId).subscribe(success => {
      this.eventTemplates = this.eventTemplates.filter(el => el.id  != templateId)
    })
  }

  loadTemplates() {
    this.dataService.loadTemplates(this.orgaID).subscribe(templates => {
        this.eventTemplates = templates;
      }
    )
  }

  openPanel(id: string) {
    this.eventeTemplatePrefillModel = undefined;
    this.isLoading = true;
    this.dataService.loadTemplateBasedOnId(this.orgaID, id).subscribe(model => {
      this.isLoading = false;
      this.eventeTemplatePrefillModel = model;
    })
  }

  persistData(id: string) : void {
    this.editMode = false;
    if (this.eventeTemplatePrefillModel) {

      this.eventeTemplatePrefillModel.childs =
        this.eventeTemplatePrefillModel.childs.map(el => { return { eventStart: el.eventStart, eventEnd: el.eventEnd } });

      this.eventeTemplatePrefillModel.childs =
        this.eventeTemplatePrefillModel.childs.slice(0,1)

      delete this.eventeTemplatePrefillModel.created;
      delete this.eventeTemplatePrefillModel.lastModified;

      this.dataService.putEventTemplateBasedOnId(this.orgaID, id, this.eventeTemplatePrefillModel).subscribe();
    }
  }
}
