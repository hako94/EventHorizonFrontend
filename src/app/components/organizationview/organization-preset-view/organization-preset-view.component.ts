import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {EventTemplateModel} from "../../../models/EventTemplateModel";
import {EventTemplatePrefillModel} from "../../../models/EventTemplatePrefillModel";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../deletion-confirmation/deletion-confirmation.component";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  eventTemplateRawRepeatValue : number = 0;

  isLoading : boolean = false;
  editMode : boolean = false;

  constructor(private dataService : DataService, private dialog : MatDialog, private snackBar : MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadTemplates()
  }

  deleteTemplate(templateId : string) {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent,{});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteTemplate(this.orgaID, templateId).subscribe(success => {
          this.eventTemplates = this.eventTemplates.filter(el => el.id  != templateId)
          this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
        });
      }
    });

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
      if (model.eventRepeatScheme) {
        this.eventTemplateRawRepeatValue = ((+ model.eventRepeatScheme.repeatCycle.slice(2,model.eventRepeatScheme.repeatCycle.length-1)) / 24);
      }
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

      this.dataService.putEventTemplateBasedOnId(this.orgaID, id, this.eventeTemplatePrefillModel).subscribe(success => {
        this.snackBar.open('Änderungen gespeichert', 'OK', {duration: 3000});
      });
    }
  }

  updateRepeatePattern() {
    if (this.eventeTemplatePrefillModel) {
      if (this.eventeTemplatePrefillModel?.eventRepeatScheme) {
        this.eventeTemplatePrefillModel.eventRepeatScheme.repeatCycle = "PT" + this.eventTemplateRawRepeatValue * 24 + "H"
      }
    }
  }
}
