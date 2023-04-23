import {UserRoleModel} from "./UserRoleModel";

export interface OrganizationInviteModel {

  id : string;
  userEmail : string;
  role : UserRoleModel;

}
