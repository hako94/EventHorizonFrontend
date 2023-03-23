import {Component, Input} from '@angular/core';
import {DataService} from "../../../services/DataService";

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})
export class OrganizationSettingsComponent {

  @Input() orgaID : string = '';

  constructor(private dataService : DataService) {
  }


  onFileSelected(event : any) {

    const file:File = event.target.files[0];

    if (file) {

      //this.fileName = file.name;

      const formData = new FormData();

      formData.append("file", file);

      this.dataService.storeFile(formData, this.orgaID).subscribe(sucess => {console.log(sucess)})
    }
  }

}
