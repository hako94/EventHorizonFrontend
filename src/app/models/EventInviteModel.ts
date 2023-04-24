import {UserRoleModel} from "./UserRoleModel";

export interface EventInviteModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRoleModel;
}
