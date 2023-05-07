import {ChildEvent} from "./ChildEventModel";

export interface EventTemplatePrefillModel {
  name : string,
  location : string,
  description : string,
  eventType : string,
  childs : ChildEvent[],
  serial? : boolean,
  pictureId? : string,
  created? : string,
  lastModified? : string,
  eventRepeatScheme? : { repeatCycle : string, repeatTimes : string }
}
