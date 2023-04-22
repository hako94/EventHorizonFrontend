import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/DataService';
import {OrganizationModel} from '../../models/OrganizationModel';
import {EventRadarItemModel} from "../../models/EventRadarItemModel";

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
  currentEvents: EventRadarItemModel[] = [];

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
   * Adds Events to event-radar that begin within the next 14 days
   */
  addAllEvents(): void {
    for (let i = 0; i < this.organizations.length; i++) {
      this.dataService.getOrganizationEvents(this.organizations[i].id).subscribe(success => {
        console.log(success[0]);
        for (let j = 0; j < success.length; j++) {
          success[j].childs.forEach(child => {
            //TODO: Das logische ODER zu einem logischen UND machen, um nur Events innerhalb der nächsten 2 wochen anzuzeigen
            if (new Date(child.eventStart) <= new Date( Date.now() + (6.048e+8 * 2)) || new Date(child.eventStart) >= new Date( Date.now())) {
              this.currentEvents.push(new class implements EventRadarItemModel {
                childId: string = child.childId;
                name: string = success[j].name;
                description: string = success[j].description;
                location: string = success[j].location;
                organizationId: string = success[j].organizationId;
                serial: boolean = success[j].serial;
                eventStart: string = child.eventStart;
                eventEnd: string = child.eventEnd;
                pictureId: string = success[j].pictureId;
                attender: boolean = success[j].attender;
                organisator: boolean = success[j].organisator;
                tutor: boolean = success[j].tutor;
              });
            }
          })
        }
      })
    }
  }

  /**
   * Returns name of organization based on OrgId
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
