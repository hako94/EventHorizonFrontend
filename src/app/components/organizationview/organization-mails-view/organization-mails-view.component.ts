import {Component, Input} from '@angular/core';
import {EmailTemplateModel} from "../../../models/EmailTemplateModel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InfoSnackbarComponent} from "./info-snackbar/info-snackbar.component";

@Component({
  selector: 'app-organization-mails-view',
  templateUrl: './organization-mails-view.component.html',
  styleUrls: ['./organization-mails-view.component.scss']
})
export class OrganizationMailsViewComponent {
  @Input() orgaID = '';

  //availableEmailTemplates : EmailTemplateModel[] = [];
  availableEmailTemplates : EmailTemplateModel[] = [
    {id: '123',
      name: 'Dankeschön',
      organizationId: '456',
      subject: 'Liebe Teilnehmer Betreff',
      text: 'Hallo zusammen, wir sind heute hier'},
    {id: '789',
      name: 'Dankeschön2',
      organizationId: '12578',
      subject: 'Liebe Menschen Betreff',
      text: 'Hallo ihr doofians, moomjääj'}
  ];
  panelOpenState: boolean = false;
  editMode: boolean = false;
  editedEmailTemplate: string = '';

  constructor(private snackbar: MatSnackBar) {
  }

  ngOnInit(): void{
    //TODO this.availableEmailTemplates = this.dataService.getAvailableEmailTemplates(this.orgaId);
  }

  toggleEdit(id: string) {
    if (!this.editMode) {
      this.editMode = true;
      this.editedEmailTemplate = id;
    } else {
      this.editMode = false;
      //TODO DataService safe Email changes
      this.editedEmailTemplate = '';
    }
  }

  deleteEmailTemplate(id: string) {
    //TODO DataService deleteEmailTemplate
    console.log("delete Email Template " + id);
  }

  openInfoSnackbar() {
    this.snackbar.openFromComponent(InfoSnackbarComponent, {
      duration: 7000,
    });
  }
}
