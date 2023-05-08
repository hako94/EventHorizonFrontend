import {ChildEvent} from "./ChildEventModel";
import {EventStatusModel} from "./EventStatusModel";
import {EventRepeatModel} from "./EventRepeatModel";

export interface EventPutModel {
  id: string;
  name: string;
  description: string;
  location: string;
  childs: ChildEvent[];
  serial: boolean;
  eventStatus: EventStatusModel;
  eventRepeatScheme?: EventRepeatModel;
}
