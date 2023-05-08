import {Component, Input} from '@angular/core';
import {EmailTemplateModel} from "../../../models/EmailTemplateModel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InfoSnackbarComponent} from "./info-snackbar/info-snackbar.component";
import {DataService} from "../../../services/DataService";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../deletion-confirmation/deletion-confirmation.component";

@Component({
  selector: 'app-organization-mails-view',
  templateUrl: './organization-mails-view.component.html',
  styleUrls: ['./organization-mails-view.component.scss']
})
export class OrganizationMailsViewComponent {
  @Input() orgaID = '';

  availableEmailTemplates: EmailTemplateModel[] = [];

  panelOpenState: boolean = false;
  editMode: boolean = false;
  editedEmailTemplate: string = '';

  constructor(private dataService: DataService, private snackbar: MatSnackBar, private dialog : MatDialog) {
  }

  ngOnInit(): void {
    this.dataService.getEmailTemplates(this.orgaID).subscribe(success => {
      this.availableEmailTemplates = success;
    })
  }

  toggleEdit(id: string) {
    if (!this.editMode) {
      this.editMode = true;
      this.editedEmailTemplate = id;
    }
  }

  saveEmailTemplate(orgId: string, templateId: string, emailTemplate: EmailTemplateModel) {
    this.dataService.saveEmailTemplate(orgId, templateId, emailTemplate).subscribe(() => {
      this.ngOnInit();
      this.snackbar.open('Email Vorlage erfolgreich gespeichert', 'OK', {duration: 3000});
    })
    this.editMode = false;
    this.editedEmailTemplate = '';
  }

  deleteEmailTemplate(templateId: string) {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent,{});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteMailTemplate(this.orgaID, templateId).subscribe(() => {
          this.ngOnInit();
          this.snackbar.open('Eintrag gelöscht', 'OK', {duration: 3000});
        });
      }
    });
    console.log("delete Email Template " + templateId);
  }

  openInfoSnackbar() {
    this.snackbar.openFromComponent(InfoSnackbarComponent, {
      duration: 7000,
    });
  }
}
