import {ChildEvent} from "./ChildEventModel";
import {EventStatusModel} from "./EventStatusModel";

export interface OrganizationEventModel {
  id : string;
  name : string;
  description : string;
  organizationName : string;
  childs : ChildEvent[];
  parentId : string;
  serial : boolean;
  location: string;
  pictureId: string;
  eventStatus: EventStatusModel;
  organizationId : string;
  invited: boolean;
  organisator : boolean;
  tutor : boolean;
  attender : boolean
}
