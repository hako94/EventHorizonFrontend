import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-organizationitem',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.scss']
})
export class OrganizationItemComponent implements OnInit{

  @Input() name = '';
  @Input() description = '';
  @Input() id = '';

  shownimage : any;


  constructor(private dataService : DataService, private sanitizer : DomSanitizer) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizationInfos(this.id).subscribe(success => {
      if (success.logoId) {
        this.dataService.getImage(this.id, success.logoId).subscribe(success => {
          let objectURL = URL.createObjectURL(success);
          this.shownimage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        })
      }
    })
  }

}
