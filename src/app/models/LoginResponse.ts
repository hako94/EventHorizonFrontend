import {UserOrganizationModel} from "./UserOrganizationModel";

export interface LoginResponse {
  token : string;
  type : string;
  id : string;
  username : string;
  email : string;
  organizations: UserOrganizationModel;
  plattformAdmin: string;
}
