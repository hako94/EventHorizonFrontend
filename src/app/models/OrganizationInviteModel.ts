import {UserRoleModel} from "./UserRoleModel";

export interface OrganizationInviteModel {

  id : string;
  email : string;
  role : UserRoleModel;

}
