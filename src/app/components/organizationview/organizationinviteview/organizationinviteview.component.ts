import {Component, Input} from '@angular/core';
import {DataService} from "../../../services/DataService";
import {OrganizationInviteModel} from "../../../models/OrganizationInviteModel";
import {UserRoleModel} from "../../../models/UserRoleModel";
import {StorageService} from "../../../services/StorageService";

@Component({
  selector: 'app-organizationinviteview',
  templateUrl: './organizationinviteview.component.html',
  styleUrls: ['./organizationinviteview.component.scss']
})
export class OrganizationinviteviewComponent {
  selectedRole : number = -1;
  editMode : boolean = false;
  editedUser : string = '';
  email : string = '';
  role : string = '';

  @Input() orgaID = '';

  invitedUsers : OrganizationInviteModel[] = [
    new class implements OrganizationInviteModel {
      email: string = 'local.test1@test.de';
      id: string = 'blablubb-ID';
      role: UserRoleModel = new class implements UserRoleModel {
        id: number = 4;
        role: string = 'teilnehmer';
      };
    },
    new class implements OrganizationInviteModel {
      email: string = 'local.test2@test.de';
      id: string = '222-ID';
      role: UserRoleModel = new class implements UserRoleModel {
        id: number = 5;
        role: string = 'gast';
      };
    }
  ];

  constructor(private dataService : DataService, private storageService : StorageService) {

  }

  ngOnInit(): void {
    this.dataService.getOrganizationInvites(this.orgaID).subscribe(success => {
      //this.invitedUsers = success;
    })
  }

  /**
   * Aufruf des DataService, um die Rolle zu einer bestimmten Einladung zu ändern
   *
   * @param inviteId
   * @param roleId
   */
  changeInviteRole(inviteId : string, roleId : number) {
    this.dataService.changeOrganizationInviteRole(this.orgaID, inviteId, roleId).subscribe(success => {
      console.log(success)
      window.location.reload();
    });
  }

  /**
   * Aufruf des DataService, um eine bestimmte Einladung zu löschen
   *
   * @param inviteId
   */
  deleteInvite(inviteId : string) {
    this.dataService.deleteOrganizationInvite(this.orgaID, inviteId).subscribe(success => {
      console.log(success)
      window.location.reload();
    });
  }

  /**
   * Schaltet zwischen dem "Bearbeiten" und "Anzeigen" Modus der Tabelle um
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
   * Überprüft, ob der aktuelle Benutzer die übergebene Rolle in der Organisation besitzt
   *
   * @param roleId
   */
  hasRole(roleId: number) : boolean {
    return this.storageService.getRoleInCurrentOrganization(this.orgaID) == roleId;
  }
}
