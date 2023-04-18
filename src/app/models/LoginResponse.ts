import {UserOrganizationModel} from "./UserOrganizationModel";

export interface LoginResponse {
  token : String;
  type : String;
  id : String;
  username : String;
  email : String;
  organizations: UserOrganizationModel;
}
