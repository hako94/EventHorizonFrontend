import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {EventTemplateModel} from "../../../models/EventTemplateModel";

@Component({
  selector: 'app-organization-preset-view',
  templateUrl: './organization-preset-view.component.html',
  styleUrls: ['./organization-preset-view.component.scss']
})
export class OrganizationPresetViewComponent implements OnInit{

  @Input()
  orgaID : string = ''

  eventTemplates : EventTemplateModel[] = [];

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

}
