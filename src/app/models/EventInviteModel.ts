import {UserRoleModel} from "./UserRoleModel";

export interface EventInviteModel {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  role: UserRoleModel;
}
