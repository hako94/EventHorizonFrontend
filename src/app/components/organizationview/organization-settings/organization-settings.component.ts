import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})
export class OrganizationSettingsComponent implements OnInit{

  @Input() orgaID : string = '';
  shownimage : any;

  constructor(private dataService : DataService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationInfos(this.orgaID).subscribe(success => {
      console.log(success)

      if (success.logoId) {
        this.dataService.getImage(this.orgaID, success.logoId).subscribe(success => {
          console.warn(success)
          let objectURL = URL.createObjectURL(success);
          this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        })
      }
    })
  }

  onFileSelected(event : any) {

    const file:File = event.target.files[0];

    if (file) {

      //this.fileName = file.name;

      const formData = new FormData();

      formData.append("file", file);

      this.dataService.storeFile(formData, this.orgaID).subscribe(sucess => {
        console.log(sucess);
        this.snackBar.open('Bild erfolgreich hochgeladen', 'OK', {duration: 3000});
        this.ngOnInit();
      }, error => {
        this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
      })
    }
  }

}
