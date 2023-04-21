import {ChildEvent} from "./ChildEventModel";

export interface OrganizationEventModel {

  id : string;
  name : string;
  description : string;
  childs : ChildEvent[];
  parentId : string;
  serial : boolean;
  location: string;
  pictureId: string;
  organizationId : string;
  organisator : boolean;
  tutor : boolean;
  attender : boolean
}
