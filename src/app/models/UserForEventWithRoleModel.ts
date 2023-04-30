import {UserRoleModel} from "./UserRoleModel";

export interface UserForEventWithRoleModel{
  id : string;
  email : string;
  vorname : string;
  nachname : string;
  role : UserRoleModel;
}
