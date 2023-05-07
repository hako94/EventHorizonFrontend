import {ChildEvent} from "./ChildEventModel";
import {EventStatusModel} from "./EventStatusModel";
import {EventRepeatModel} from "./EventRepeatModel";

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
  eventRepeatScheme?: EventRepeatModel;
  organizationId : string;
  invited: boolean;
  organisator : boolean;
  tutor : boolean;
  attender : boolean
}
