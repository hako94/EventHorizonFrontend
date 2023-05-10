import {Component, Input} from '@angular/core';
import {EmailTemplateModel} from "../../../../models/EmailTemplateModel";
import {NotificationInfoModel} from "../../../../models/NotificationInfoModel";
import {DataService} from "../../../../services/DataService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StorageService} from "../../../../services/StorageService";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";

@Component({
  selector: 'app-event-mailsettings-view',
  templateUrl: './event-mailsettings-view.component.html',
  styleUrls: ['./event-mailsettings-view.component.scss']
})
export class EventMailsettingsViewComponent {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;
  @Input() isChild: boolean = false;

  availableMailTemplates: EmailTemplateModel[] = [];
  usedMailTemplates: NotificationInfoModel[] = [];

  editMode: boolean = false;
  editedId: string = "";

  timeAmount: number = 3;
  timeUnit: string = "D";
  timeSlot: string = "before";

  constructor(private dataService: DataService, private snackBar: MatSnackBar, private storageService: StorageService, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    if (this.roleIdInEvent != 10) {
      this.router.navigate(['/organizations/' + this.orgaID + '/event/' + this.eventID + '/details'], {queryParams: {view: 'description'}});
    }

    this.availableMailTemplates = [];

    this.dataService.getNotificationInfos(this.orgaID, this.eventID).subscribe(success => {
      this.usedMailTemplates = success;
      console.log('Used success is...')
      console.log(success)


      this.dataService.getEmailTemplates(this.orgaID).subscribe(success => {
        success.forEach(availableTemplate => {
          let alreadyUsed: boolean = false;
          this.usedMailTemplates.forEach(usedTemplate => {
            if (availableTemplate.id == usedTemplate.templateId) {
              alreadyUsed = true;
            }
          })
          if (!alreadyUsed) {
            this.availableMailTemplates.push(availableTemplate);
          }
        })
      })
    })
  }

  /**
   * Checks if a template with this templateId is already used in a mail-rule
   * @param templateId
   */
  isUsed(templateId: string): boolean {
    // @ts-ignore
    this.usedMailTemplates.forEach(usedTemplate => {
      if (usedTemplate.templateId == templateId) {
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
   *
   * @param templateId
   * @param notificationId
   */
  saveRule(templateId: string, notificationId: string) {
    if (this.timeAmount == null || undefined) {
      this.snackBar.open('Bitte füllen Sie alle Pflichtfelder aus', 'OK', {duration: 3000});
      return;
    }

    let timeScheme: string = 'PT';
    if (this.timeUnit == 'D') {
      timeScheme += ((this.timeAmount * 24) + 'H');
    } else {
      timeScheme += '' + this.timeAmount + this.timeUnit;
    }

    let isBefore: boolean = (this.timeSlot == 'before');

    console.log(notificationId)

    if (notificationId == "") {
      this.dataService.postNotificationInfo(this.orgaID, this.eventID, templateId, timeScheme, isBefore).subscribe(() => {
        this.snackBar.open('Versandregel erfolgreich geändert', 'OK', {duration: 3000});
        this.editMode = false;
        this.editedId = "";
        this.ngOnInit();
      }, error => {
        this.editMode = false;
        this.editedId = '';
        this.ngOnInit();
      })
    } else {
      this.dataService.deleteNotificationInfo(this.orgaID, this.eventID, notificationId).subscribe(success => {
        this.dataService.postNotificationInfo(this.orgaID, this.eventID, templateId, timeScheme, isBefore).subscribe(() => {
          this.snackBar.open('Versandregel erfolgreich geändert', 'OK', {duration: 3000});
          this.editMode = false;
          this.editedId = "";
          this.ngOnInit();
        }, error => {
          this.editMode = false;
          this.editedId = '';
          this.ngOnInit();
        })
      }, error => {
        this.editMode = false;
        this.editedId = '';
        this.ngOnInit();
      })
    }

    console.log(timeScheme);
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

  /**
   * Deletes the mail-rule of the given id
   *
   * @param id
   */
  delete(id: string) {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteNotificationInfo(this.orgaID, this.eventID, id).subscribe(() => {
          this.snackBar.open('Eintrag gelöscht', 'OK', {duration: 3000});
          this.ngOnInit();
        })
      }
    });
  }


}
