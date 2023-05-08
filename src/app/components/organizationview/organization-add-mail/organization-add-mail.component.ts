import {Component} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {StorageService} from "../../../services/StorageService";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../deletion-confirmation/deletion-confirmation.component";

@Component({
  selector: 'app-organization-add-mail',
  templateUrl: './organization-add-mail.component.html',
  styleUrls: ['./organization-add-mail.component.scss']
})

/**
 * Handles the creation of a new mail template
 */
export class OrganizationAddMailComponent {

  orgaID : string = '';

  mailName : string = '';
  mailSubject : string = '';
  mailText : string = '';

  constructor(private dataService : DataService, private storageService : StorageService, private router : Router, private activatedRoute : ActivatedRoute, private snackBar : MatSnackBar, private dialog : MatDialog) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.orgaID = params['id'];
    });

    if (this.storageService.getRoleInCurrentOrganization(this.orgaID) != 2
      && this.storageService.getRoleInCurrentOrganization(this.orgaID) != 1) {
      this.router.navigateByUrl('/dashboard');
    }
  }


    /**
   * Saves the current input into a new mail template and routes back to the mail-template overview page
   */
  saveTemplate() {
    console.log(this.mailName + ' ## ' + this.mailSubject + ' ## ' + this.mailText);
    if (this.mailName=='' || this.mailSubject=='' || this.mailText=='') {
      this.snackBar.open('Bitte alle Felder ausfüllen', 'OK', {duration: 3500});
    } else {
      this.dataService.postMailTemplate(this.mailName, this.orgaID, this.mailSubject, this.mailText).subscribe(() => {
        this.snackBar.open('Mail-Vorlage erfolgreich abgespeichert', 'OK', {duration: 3500});
        this.router.navigate(['/organizations/' + this.orgaID], {queryParams: {view: 'mails'}});
      });
    }
  }

  /**
   * discards the input and routes back to the mail-template overview page
   */
  discardTemplate() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent,{data: {message: 'Wollen Sie die Vorlage wirklich verwerfen?'}});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.snackBar.open('Vorlage verworfen', 'OK', {duration: 3000});
        this.router.navigate(['/organizations/' + this.orgaID], {queryParams: {view: 'mails'}});
      }
    });
  }
}
