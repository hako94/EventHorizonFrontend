import {UserRoleModel} from "./UserRoleModel";

export interface OrganizationUserModel {
  id: string,
  email: string,
  vorname: string,
  nachname: string,
  role: UserRoleModel
}
