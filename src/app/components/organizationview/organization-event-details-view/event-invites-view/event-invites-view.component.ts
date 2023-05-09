import {Component, Input} from '@angular/core';
import {DataService} from "../../../../services/DataService";
import {StorageService} from "../../../../services/StorageService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EventInviteModel} from "../../../../models/EventInviteModel";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeletionConfirmationComponent} from "../../../deletion-confirmation/deletion-confirmation.component";

@Component({
  selector: 'app-event-invites-view',
  templateUrl: './event-invites-view.component.html',
  styleUrls: ['./event-invites-view.component.scss']
})
export class EventInvitesViewComponent {

  selectedRole : number = -1;
  editMode : boolean = false;
  editedUser : string = '';
  email : string = '';
  role : string = '';

  @Input() orgaID = '';
  @Input() eventID = '';
  @Input() roleIdInEvent!: number;
  @Input() isChild = false;

  invitedUsers : EventInviteModel[] = [];

  constructor(private dataService : DataService, private storageService : StorageService, private snackBar : MatSnackBar, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.roleIdInEvent == 12) {
      this.router.navigate(['/organizations/' + this.orgaID + '/event/' + this.eventID + '/details'], {queryParams: {view: 'description'}});
    }
    this.dataService.getEventInvites(this.orgaID, this.eventID).subscribe(success => {
      this.invitedUsers = success;
      console.log(this.invitedUsers);
    })
  }

  /**
   * Calls DataService to change the role of a specified invitation
   *
   * @param inviteId
   * @param roleId
   */
  changeInviteRole(inviteId : string, roleId : number) {
    this.dataService.changeEventInviteRole(this.orgaID, this.eventID, inviteId, roleId).subscribe(success => {
      console.log(success)
      this.ngOnInit();
      this.snackBar.open('Rolle erfolgreich geändert', 'OK', {duration: 3000});
    }, error => {
    });
  }

  /**
   * Calls the DataService to delete a specific invitation
   *
   * @param inviteId
   */
  deleteInvite(inviteId : string) {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {data:
        {message: 'Wollen Sie den Eintrag wirklich löschen und die Event-Einladung zurückziehen?'}
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dataService.deleteEventInvite(this.orgaID, this.eventID, inviteId).subscribe(success => {
          console.log(success)
          this.ngOnInit();
          this.snackBar.open('Einladung entfernt', 'OK', {duration: 3000});
        });
      }
    })
  }

  /**
   * Changes between 'edit' and 'view' mode of the table
   *
   * @param id
   */
  edit(id: string) {
    if (!this.editMode) {
      this.editMode = true;
      this.editedUser = id;
    } else {
      this.changeInviteRole(id, this.selectedRole)
      this.editMode = false;
      this.editedUser = '';
      this.selectedRole = -1;
    }
  }

  /**
   * Checks if frontend-user has the specified role
   *
   * @param roleId
   */
  hasRole(roleId: number) : boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }

  /**
   * Checks if current user is tutor in current event
   */
  isTutor() : boolean {
    return this.roleIdInEvent == 11;
  }

  /**
   * Checks if current user is organizer in current event
   */
  isOrganizer() : boolean {
    return this.roleIdInEvent == 10;
  }
}
