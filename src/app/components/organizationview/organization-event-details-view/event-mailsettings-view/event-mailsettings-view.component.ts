import {Component, Input} from '@angular/core';
import {EmailTemplateModel} from "../../../../models/EmailTemplateModel";
import {NotificationInfoModel} from "../../../../models/NotificationInfoModel";
import {DataService} from "../../../../services/DataService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../../../services/StorageService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-event-mailsettings-view',
  templateUrl: './event-mailsettings-view.component.html',
  styleUrls: ['./event-mailsettings-view.component.scss']
})
export class EventMailsettingsViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';

  availableMailTemplates : EmailTemplateModel[] = [];
  usedMailTemplates : NotificationInfoModel[] = [];

  editMode : boolean = false;
  editedId : string = "";

  constructor(private dataService : DataService, private snackBar : MatSnackBar, private storageService : StorageService, private router : Router) {

  }

  ngOnInit(): void {
    this.dataService.getNotificationInfos(this.orgaID, this.eventID).subscribe(success => {
      this.usedMailTemplates = success;
    }, error => {
      this.snackBar.open('Fehler beim Laden der Versandregeln', 'OK', {duration: 3000});
    })
    this.dataService.getEmailTemplates(this.orgaID).subscribe(success => {
      this.availableMailTemplates = success;
      console.log('Available success is...')
      console.log(success)
    }, error => {
      this.snackBar.open('Fehler beim Laden der Mail-Vorlagen', 'OK', {duration: 3000});
    })
  }

  /**
   * Checks if a template with this templateId is already used in a mail-rule
   * @param templateId
   */
  isUsed(templateId: string) : boolean {
    // @ts-ignore
    this.usedMailTemplates.forEach(usedTemplate => {
      if (usedTemplate.templateId == templateId) {
        console.log('IS USED with id: ' + templateId);
        return true;
      }
    })
    return false;
  }

  /**
   * Adds Mailtemplate to the used template list and switches to editMode
   * @param template
   */
  addToUsed(template: EmailTemplateModel) {
    this.editMode = true;
    this.editedId = template.id;
    this.usedMailTemplates.push(new class implements NotificationInfoModel {
      id: string = "";
      sent: boolean = false;
      templateId: string = template.id;
      templateName: string = template.name;
      triggerTime: Date = new Date(Date.now());
    })

    this.isUsed(template.id);
  }

  /**
   * Saves a new rule and leaves editMode
   */
  saveRule() {
    this.editMode = false;
    this.editedId = "";
  }

  /**
   * Starts editMode for the current template
   *
   * @param templateId
   */
  edit(templateId: string) {
    this.editMode = true;
    this.editedId = templateId;
  }
}
