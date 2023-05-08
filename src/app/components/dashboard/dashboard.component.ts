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
    });

    this.addAllEvents();

  }

  /**
   * Adds Events to event-radar that begin within the next 6 weeks
   */
  addAllEvents() {
    let periodStart : string = new Date(Date.now() - (6.048e+8)).toISOString().slice(0, 10);
    let periodEnd : string = new Date(Date.now() + (6.048e+8 * 2)).toISOString().slice(0, 10);
    this.dataService.getAllEventsForUser(periodStart, periodEnd).subscribe(success => {
      this.currentEvents = success;
      success.forEach(console.log)
    })
  }
}
