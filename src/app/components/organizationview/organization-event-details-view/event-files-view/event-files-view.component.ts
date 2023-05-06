import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FileInfoModel} from "../../../../models/FileInfoModel";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";

@Component({
  selector: 'app-event-files-view',
  templateUrl: './event-files-view.component.html',
  styleUrls: ['./event-files-view.component.scss']
})
export class EventFilesViewComponent implements OnInit {

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;
  availableFilesInfos: FileInfoModel[] = [];

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationInfos(this.orgaID).subscribe(success => {
      console.log(success)
      this.dataService.getFileInfosForEvent(this.orgaID, this.eventID).subscribe(success => {
        this.availableFilesInfos = success;
        console.log(this.availableFilesInfos)
      })
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log('file', file);

    if (file && (file.size <= 10000000)) {

      let fileName = file.name;
      let formData = new FormData();

      formData.set('name', fileName);
      formData.set('file', file);

      this.dataService.storeFileForEvent(formData, this.orgaID, this.eventID).subscribe(success => {
        console.log(success);
        this.snackBar.open('Datei erfolgreich hochgeladen', 'OK', {duration: 3500});
        this.ngOnInit();
      })
    } else {
      this.snackBar.open('Die Datei ist zu groß, bitte nur Dateien mit max. 10MB hochladen', 'OK', {duration: 3500});
    }
  }

  downloadFile(fileId: string, fileName: string): void{
    this.dataService.getFileForEvent(this.orgaID, fileId, this.eventID).subscribe(success => {
      let blob : Blob = success.body as Blob;
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    })
  }

  deleteFile(fileId: string): void{
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {});
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteFileFromEvent(this.orgaID, this.eventID, fileId).subscribe(success => {
          this.snackBar.open('Datei erfolgreich gelöscht', 'OK', {duration: 3000});
          this.ngOnInit();
        })
      }
    })
  }
}
