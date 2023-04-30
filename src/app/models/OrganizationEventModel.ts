import {ChildEvent} from "./ChildEventModel";
import {EventStatusModel} from "./EventStatusModel";

export interface OrganizationEventModel {
  id : string;
  name : string;
  organizationName : string;
  description : string;
  childs : ChildEvent[];
  parentId : string;
  serial : boolean;
  location: string;
  pictureId: string;
  eventStatus: EventStatusModel;
  organizationId : string;
  organisator : boolean;
  tutor : boolean;
  attender : boolean
}
