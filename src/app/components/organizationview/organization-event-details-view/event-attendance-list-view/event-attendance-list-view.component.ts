import {Component, Input} from '@angular/core';
import {UserAtEventModel} from "../../../../models/UserAtEventModel";
import {DataService} from "../../../../services/DataService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Router} from "@angular/router";
import {OrganizationUserModel} from "../../../../models/OrganizationUserModel";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-event-attendance-list-view',
  templateUrl: './event-attendance-list-view.component.html',
  styleUrls: ['./event-attendance-list-view.component.scss']
})
export class EventAttendanceListViewComponent {
  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;
  @Input() eventStatus!: number;
  attendee: UserAtEventModel[] = [];

  selectedRole: number = 12;
  invitedEmail: string = '';
  inviteLoading: boolean = false;
  availableUsersForEventInvite: OrganizationUserModel[] = [];
  filteredUsersForEventInvite?: Observable<OrganizationUserModel[]>;
  eventInviteControl = new FormControl<OrganizationUserModel>({
    id: '',
    vorname: '',
    nachname: '',
    email: '',
    role: {
      id: 0,
      role: ''
    }
  });

  constructor(private dataService: DataService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.roleIdInEvent == 12) {
      this.router.navigate(['/organizations/' + this.orgaID + '/event/' + this.eventID + '/details'], {queryParams: {view: 'description'}});
    }
    this.attendee = [];
    this.dataService.getAttendeesWithPresence(this.orgaID, this.eventID).subscribe(success => {
      success.forEach(attender => {
        if (attender.vorname != null && attender.nachname != null) {
          this.attendee.push(attender)
        }
      });
    });
    this.availableUsersForEventInvite = [];
    this.dataService.getOrganizationMember(this.orgaID).subscribe(success => {
      success.forEach(member => {
        if (member.email != null) {
          this.availableUsersForEventInvite.push(member)
        }
      })
    });
    this.loadOptions();
  }


  /**
   * sets boolean value for attendance correct and sends update via data service
   * @param event
   * @param attenderId
   */
  saveAttendeeList(event: MatCheckboxChange, attenderId: string): void {
    const editedAttenderIndex = this.attendee.findIndex(i => i.id === attenderId);
    this.attendee[editedAttenderIndex].here = event.checked;
  }

  pushAttendeeList(): void {
    this.dataService.saveAttendeesWithPresence(this.orgaID, this.eventID, this.attendee).subscribe(success => {
      this.snackBar.open('Anwesenheiten erfolgreich gespeichert', 'OK', {duration: 3000});
    });
  }

  loadOptions(): void {
    this.filteredUsersForEventInvite = this.eventInviteControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const email = typeof value === 'string' ? value : value;
        return email ? this._filterEmail(email.toString()) : this.availableUsersForEventInvite.slice();
      }),
    );
  }

  private _filterEmail(email: string): OrganizationUserModel[] {
    const filterValue: string = email.toLowerCase();
    return this.availableUsersForEventInvite.filter(filteredMember => filteredMember.email.toLowerCase().includes(filterValue));
  }

  displayMemberEmail(member: OrganizationUserModel): string {
    return member && member.email ? member.email : '';
  }

  private requireMatch(input: string): boolean {
    let validOptions = this.availableUsersForEventInvite.map(members => members.email);
    return validOptions.includes(input);
  }

  bookSubmit(): void {
    this.inviteLoading = true;
    if (this.requireMatch(this.eventInviteControl.value!.email)) {
      console.log(this.selectedRole);
      this.dataService.acceptEvent(this.orgaID, this.eventID, this.eventInviteControl.value!.email).subscribe(success => {
        console.log(success);
        this.snackBar.open('Einladung wurde erfolgreich versandt', 'OK', {duration: 3000});
        this.inviteLoading = false;
      })
    } else {
      this.snackBar.open('Email muss aus in den Vorschlägen vorhanden sein', 'Ok', {duration: 3500});
      this.inviteLoading = false;
    }
  }

}
