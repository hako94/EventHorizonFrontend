import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/DataService';
import {OrganizationModel} from '../../models/OrganizationModel';
import {OrganizationEventModel} from "../../models/OrganizationEventModel";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  organizations: OrganizationModel[] = [];
  currentEvents: OrganizationEventModel[] = [];

  constructor(private readonly dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getOrganizations().subscribe((success: OrganizationModel[]) => {
      console.log('DATA:', success[0]?.name);
      this.organizations = success;
      this.addAllEvents();
      console.log(this.currentEvents)
      console.log(this.organizations[0].id)
      console.log(this.dataService.getOrganizationEvents('10'))
    });


  }

  addAllEvents(): void {
    for (let i = 0; i < this.organizations.length; i++) {
      this.dataService.getOrganizationEvents(this.organizations[i].id).subscribe(success => {
        console.log(success[0]);
        this.currentEvents = [...this.currentEvents, ...success];
      })
    }
  }

  getOrganizationNameById(id: string): string{
    for (let i = 0; i < this.organizations.length; i++) {
      if(this.organizations[i].id == id){
        return this.organizations[i].name;
      }
    }
    return '-';
  }
}
