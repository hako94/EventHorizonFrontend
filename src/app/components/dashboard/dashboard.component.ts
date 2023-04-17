import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/DataService';
import {OrganizationModel} from '../../models/OrganizationModel';
import {OrganizationEventModel} from "../../models/OrganizationEventModel";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Komponente des EventHorizon-Dashboards
 *
 * beinhaltet Organisationen-Übersicht und Event-Radar
 */
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

  /**
   * Fügt Events, die innerhalb der nächsten 2 Wochen stattfinden, dem Event-Radar hinzu.
   */
  addAllEvents(): void {
    for (let i = 0; i < this.organizations.length; i++) {
      this.dataService.getOrganizationEvents(this.organizations[i].id).subscribe(success => {
        console.log(success[0]);
        for (let i = 0; i < success.length; i++) {
          let upcomingEventDate : Date = new Date(success[i].eventStart);
          if(upcomingEventDate <= new Date( Date.now() + (6.048e+8 * 2)) && upcomingEventDate >= new Date( Date.now())) {
            this.currentEvents.push(success[i]);
          }
        }
      })
    }
  }

  /**
   * Liefert den Name der Organisation anhand der OrganisationsID zurück
   *
   * @param id
   */
  getOrganizationNameById(id: string): string{
    for (let i = 0; i < this.organizations.length; i++) {
      if(this.organizations[i].id == id){
        return this.organizations[i].name;
      }
    }
    return '-';
  }
}
