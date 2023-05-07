import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserForEventWithRoleModel} from "../../../../models/UserForEventWithRoleModel";
import {OrganizationUserModel} from "../../../../models/OrganizationUserModel";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";

@Component({
  selector: 'app-event-attender-view',
  templateUrl: './event-attender-view.component.html',
  styleUrls: ['./event-attender-view.component.scss']
})
export class EventAttenderViewComponent implements OnInit {
  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;

  ownRoleInOrg: number = -1;
  attendee: UserForEventWithRoleModel[] = [];
  editMode: boolean = false;
  editedUser: string = '';
  selectedRoleForInvite: number = 12;
  selectedRoleForChange: number = 12;
  invitedEmail: string = '';
  invitedUser: string = '';
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

  constructor(private dataService: DataService, private storageService: StorageService, private snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    console.log("ngonoinit");
    this.attendee = [];
    this.dataService.getAttendeesWithRole(this.orgaID, this.eventID).subscribe(success => {
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
    this.ownRoleInOrg = this.storageService.getRoleInCurrentOrganization(this.orgaID);
    console.log("Rolle:" + this.roleIdInEvent);
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


  /**
   * Checks if current user has specified role in current organization
   *
   * @param roleId
   */
  hasRole(roleId: number): boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }

  displayMemberEmail(member: OrganizationUserModel): string {
    return member && member.email ? member.email : '';
  }

  private _filterEmail(email: string): OrganizationUserModel[] {
    const filterValue: string = email.toLowerCase();
    return this.availableUsersForEventInvite.filter(filteredMember => filteredMember.email.toLowerCase().includes(filterValue));
  }

  private requireMatch(input: string): boolean {
    let validOptions = this.availableUsersForEventInvite.map(members => members.email);
    return validOptions.includes(input);
  }

  enableEdit(id: string) {
    console.log("RolleEnableEdit:" + this.roleIdInEvent);
    if (!this.editMode) {
      this.editMode = true;
      this.editedUser = id;
    }
  }

  saveAttenderRole(orgId: string, attenderId: string, role: number) {
    console.log("saved new role " + role + "for attender " + attenderId);
    this.dataService.saveAttenderRole(orgId, this.eventID, attenderId, role).subscribe(() => {
      this.ngOnInit();
      this.snackBar.open('Rolle erfolgreich geändert', 'OK', {duration: 3000});
    })
    this.editMode = false;
    this.editedUser = '';
    this.selectedRoleForChange = 12;
  }

  deleteAttender(attenderEmail: string): void {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {message: 'Wollen Sie den Eintrag wirklich löschen und den Teilnehmer vom Event abmelden?'}
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log("deleted attender " + attenderEmail);
        this.dataService.deleteAttenderFromEvent(this.orgaID, this.eventID, attenderEmail).subscribe(success => {
          this.snackBar.open('Teilnehmer abgemeldet', 'OK', {duration: 3000});
          this.ngOnInit();
        });
      }
    })
  }

  inviteSubmit(): void {
    this.inviteLoading = true;
    if (this.requireMatch(this.eventInviteControl.value!.email)) {
      console.log(this.selectedRoleForInvite);
      console.log(this.eventInviteControl.value!.id);
      this.dataService.inviteUserToEvent(this.orgaID, this.eventID, this.eventInviteControl.value!.id, this.selectedRoleForInvite).subscribe(success => {
        this.invitedUser = success;
        this.snackBar.open('Einladung wurde erfolgreich versandt', 'OK', {duration: 3000});
        this.inviteLoading = false;
      }, error => {
        this.inviteLoading = false;
      })
    } else {
      this.snackBar.open('Email muss aus in den Vorschlägen vorhanden sein', 'Ok', {duration: 3500});
      this.inviteLoading = false;
    }
  }

  /**
   * Checks if current user is organizer in current event
   */
  isOrganizer() : boolean {
    return this.roleIdInEvent == 10;
  }
}
